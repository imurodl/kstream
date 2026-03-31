<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Show, Genre } from '../types'
import { discoverKoreanTV, searchTV, getTVGenres, NETWORKS } from '../services/tmdb'
import ContentCard from '../components/ContentCard.vue'
import SkeletonCard from '../components/SkeletonCard.vue'
import FilterChip from '../components/FilterChip.vue'

const route = useRoute()

const shows = ref<Show[]>([])
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

const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'first_air_date.desc', label: 'Newest' },
]

const networkOptions = [
  { id: '', label: 'All' },
  { id: NETWORKS.KBS, label: 'KBS' },
  { id: NETWORKS.MBC, label: 'MBC' },
  { id: NETWORKS.SBS, label: 'SBS' },
]

async function fetchShows(reset = true) {
  if (reset) {
    page.value = 1
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const res = isSearching.value
      ? await searchTV(searchQuery.value, page.value)
      : await discoverKoreanTV({
          page: page.value,
          sortBy: sortBy.value,
          genreId: selectedGenre.value || undefined,
          networkId: selectedNetwork.value || undefined,
        })

    if (reset) {
      shows.value = res.results
    } else {
      shows.value.push(...res.results)
    }
    totalPages.value = res.total_pages
  } catch (e) {
    error.value = 'Failed to load shows. Please try again.'
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function loadMore() {
  if (page.value < totalPages.value) {
    page.value++
    fetchShows(false)
  }
}

// Re-fetch when filters change
watch([selectedGenre, selectedNetwork, sortBy], () => {
  if (!isSearching.value) fetchShows()
})

// Re-fetch when search query changes
watch(searchQuery, () => fetchShows())

onMounted(async () => {
  const genreRes = await getTVGenres()
  genres.value = genreRes.genres
  fetchShows()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Title -->
    <h1 class="text-2xl sm:text-3xl font-bold text-white mb-6">
      <template v-if="isSearching">Results for "{{ searchQuery }}"</template>
      <template v-else>Browse</template>
    </h1>

    <!-- Filters (hidden during search) -->
    <div v-if="!isSearching" class="space-y-4 mb-8">
      <!-- Genre chips -->
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <FilterChip label="All" :active="selectedGenre === ''" @click="selectedGenre = ''" />
        <FilterChip
          v-for="genre in genres"
          :key="genre.id"
          :label="genre.name"
          :active="selectedGenre === String(genre.id)"
          @click="selectedGenre = selectedGenre === String(genre.id) ? '' : String(genre.id)"
        />
      </div>

      <!-- Network tabs + Sort -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex gap-2">
          <FilterChip
            v-for="net in networkOptions"
            :key="net.id"
            :label="net.label"
            :active="selectedNetwork === net.id"
            @click="selectedNetwork = net.id"
          />
        </div>

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

    <!-- Error state -->
    <div v-if="error" class="text-center py-20">
      <p class="text-red-400 text-lg mb-2">{{ error }}</p>
      <button @click="error = ''; fetchShows()" class="text-sm text-purple-400 hover:text-purple-300">Try again</button>
    </div>

    <!-- Loading grid -->
    <div v-else-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <SkeletonCard v-for="i in 18" :key="i" class="!w-full" />
    </div>

    <!-- Results grid -->
    <template v-else>
      <div v-if="shows.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">No shows found.</p>
        <p class="text-gray-600 text-sm mt-1">Try adjusting your filters or search query.</p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <ContentCard
          v-for="show in shows"
          :key="show.id"
          :show="show"
          class="!w-full"
        />
      </div>

      <!-- Load More -->
      <div v-if="page < totalPages" class="flex justify-center mt-8">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
        >
          {{ loadingMore ? 'Loading...' : 'Load More' }}
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
