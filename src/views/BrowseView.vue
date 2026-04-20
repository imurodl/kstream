<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { ContentItem, Genre } from '../types'
import { discoverByCategory, searchByCategory, getGenresByCategory, NETWORKS } from '../services/tmdb'
import { useCategoryStore } from '../stores/category'
import ContentCard from '../components/ContentCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import FilterChip from '../components/FilterChip.vue'

const { t } = useI18n()
const route = useRoute()
const categoryStore = useCategoryStore()

const items = ref<ContentItem[]>([])
const genres = ref<Genre[]>([])
const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')
const page = ref(1)
const totalPages = ref(1)

const selectedGenre = ref<string>('')
const selectedNetwork = ref<string>('')
const sortBy = ref<string>('popularity.desc')

const searchQuery = computed(() => (route.query.q as string) || '')
const isSearching = computed(() => searchQuery.value.length > 0)

const sortOptions = computed(() => [
  { value: 'popularity.desc', label: t('browse.popularity') },
  { value: 'vote_average.desc', label: t('browse.rating') },
  { value: categoryStore.active.mediaType === 'movie' ? 'release_date.desc' : 'first_air_date.desc', label: t('browse.newest') },
])

const networkOptions = computed(() => [
  { id: '', label: t('browse.all') },
  { id: NETWORKS.KBS, label: 'KBS' },
  { id: NETWORKS.MBC, label: 'MBC' },
  { id: NETWORKS.SBS, label: 'SBS' },
])

const showNetworks = computed(() => categoryStore.active.hasNetworks)

async function fetchItems(reset = true) {
  if (reset) {
    page.value = 1
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const res = isSearching.value
      ? await searchByCategory(categoryStore.activeKey, searchQuery.value, page.value)
      : await discoverByCategory(categoryStore.activeKey, {
          page: page.value,
          sortBy: sortBy.value,
          genreId: selectedGenre.value || undefined,
          networkId: selectedNetwork.value || undefined,
        })

    if (reset) {
      items.value = res.results
    } else {
      items.value.push(...res.results)
    }
    totalPages.value = res.total_pages
  } catch (e) {
    error.value = t('browse.errorLoad')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function loadMore() {
  if (page.value < totalPages.value) {
    page.value++
    fetchItems(false)
  }
}

async function loadGenres() {
  const genreRes = await getGenresByCategory(categoryStore.activeKey)
  genres.value = genreRes.genres
}

watch([selectedGenre, selectedNetwork, sortBy], () => {
  if (!isSearching.value) fetchItems()
})

watch(searchQuery, () => fetchItems())

watch(() => categoryStore.activeKey, async () => {
  selectedGenre.value = ''
  selectedNetwork.value = ''
  sortBy.value = 'popularity.desc'
  await loadGenres()
  fetchItems()
})

onMounted(async () => {
  await loadGenres()
  fetchItems()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
      <template v-if="isSearching">{{ t('browse.resultsFor', { query: searchQuery }) }}</template>
      <template v-else>{{ t('browse.title') }}</template>
    </h1>
    <p class="text-sm text-gray-500 mb-6">
      {{ categoryStore.active.emoji }} {{ t(categoryStore.active.labelKey) }}
    </p>

    <div v-if="!isSearching" class="space-y-4 mb-8">
      <div class="flex flex-wrap gap-2 gap-y-3">
        <FilterChip :label="t('browse.all')" :active="selectedGenre === ''" @click="selectedGenre = ''" />
        <FilterChip
          v-for="genre in genres"
          :key="genre.id"
          :label="genre.name"
          :active="selectedGenre === String(genre.id)"
          @click="selectedGenre = selectedGenre === String(genre.id) ? '' : String(genre.id)"
        />
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div v-if="showNetworks" class="flex gap-2">
          <FilterChip
            v-for="net in networkOptions"
            :key="net.id"
            :label="net.label"
            :active="selectedNetwork === net.id"
            @click="selectedNetwork = net.id"
          />
        </div>
        <span v-else />

        <select
          v-model="sortBy"
          class="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none focus:border-purple-500"
        >
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="error" class="text-center py-20">
      <p class="text-red-400 text-lg mb-2">{{ error }}</p>
      <button @click="error = ''; fetchItems()" class="text-sm text-purple-400 hover:text-purple-300">{{ t('browse.tryAgain') }}</button>
    </div>

    <div v-else-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <SkeletonCard v-for="i in 18" :key="i" class="!w-full" />
    </div>

    <template v-else>
      <div v-if="items.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">{{ t('browse.noResults') }}</p>
        <p class="text-gray-600 text-sm mt-1">{{ t('browse.noResultsHint') }}</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <ContentCard
          v-for="item in items"
          :key="`${item.media_type}-${item.id}`"
          :item="item"
          class="!w-full"
        />
      </div>

      <div v-if="page < totalPages" class="flex justify-center mt-8">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
        >
          {{ loadingMore ? t('browse.loading') : t('browse.loadMore') }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
