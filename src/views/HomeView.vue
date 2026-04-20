<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ContentItem } from '../types'
import { discoverByCategory } from '../services/tmdb'
import { useDragScroll } from '../composables/useDragScroll'
import { useWatchlistStore } from '../stores/watchlist'
import { useCategoryStore } from '../stores/category'
import { CATEGORIES, type CategoryKey } from '../config/categories'
import HeroSection from '../components/HeroSection.vue'
import ContentRow from '../components/ContentRow.vue'
import ContinueWatchingCard from '../components/ContinueWatchingCard.vue'
import CategoryTile from '../components/CategoryTile.vue'

const { t } = useI18n()
const watchlistStore = useWatchlistStore()
const categoryStore = useCategoryStore()
const continueWatching = computed(() => watchlistStore.getContinueWatching())
const cwScrollRef = ref<HTMLElement | null>(null)
useDragScroll(cwScrollRef)

const heroItems = ref<ContentItem[]>([])
const rowsByCategory = ref<Record<CategoryKey, ContentItem[]>>({} as Record<CategoryKey, ContentItem[]>)
const loading = ref(true)
const error = ref('')

const withPoster = (items: ContentItem[]) => items.filter(i => i.poster_path)

async function loadAll() {
  loading.value = true
  error.value = ''
  try {
    const responses = await Promise.all(
      CATEGORIES.map(c => discoverByCategory(c.key, { sortBy: 'popularity.desc' }).catch(() => null))
    )

    const next: Record<string, ContentItem[]> = {}
    CATEGORIES.forEach((c, idx) => {
      const res = responses[idx]
      next[c.key] = res ? withPoster(res.results) : []
    })
    rowsByCategory.value = next as Record<CategoryKey, ContentItem[]>

    const activeRow = next[categoryStore.activeKey] || []
    heroItems.value = activeRow.filter(i => i.backdrop_path).slice(0, 5)
  } catch (e) {
    error.value = t('home.errorLoad')
  } finally {
    loading.value = false
  }
}

watch(() => categoryStore.activeKey, () => {
  const activeRow = rowsByCategory.value[categoryStore.activeKey] || []
  heroItems.value = activeRow.filter(i => i.backdrop_path).slice(0, 5)
})

onMounted(loadAll)
</script>

<template>
  <div>
    <div v-if="error" class="flex items-center justify-center min-h-[60vh] px-4">
      <div class="text-center">
        <p class="text-red-400 text-lg mb-2">{{ error }}</p>
        <p class="text-gray-500 text-sm">{{ t('home.errorHint') }}</p>
      </div>
    </div>

    <template v-else>
      <div v-if="loading" class="w-full h-[70vh] min-h-[400px] max-h-[700px] bg-gray-900 animate-pulse" />
      <HeroSection v-else-if="heroItems.length" :items="heroItems" />

      <section v-if="continueWatching.length" class="mt-6 mb-8">
        <h2 class="text-lg sm:text-xl font-semibold text-white mb-3 px-4 sm:px-6 lg:px-8">{{ t('home.continueWatching') }}</h2>
        <div ref="cwScrollRef" class="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide">
          <ContinueWatchingCard
            v-for="item in continueWatching"
            :key="`${item.mediaType}-${item.showId}-${item.episodeId}`"
            :item="item"
          />
        </div>
      </section>

      <!-- Discover strip -->
      <section class="mt-6 mb-8">
        <h2 class="text-lg sm:text-xl font-semibold text-white mb-3 px-4 sm:px-6 lg:px-8">{{ t('home.discover') }}</h2>
        <div class="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide">
          <CategoryTile v-for="cat in CATEGORIES" :key="cat.key" :category="cat" />
        </div>
      </section>

      <div class="mt-6 space-y-2">
        <ContentRow
          v-for="cat in CATEGORIES"
          :key="cat.key"
          :title="t('home.trendingIn', { category: t(cat.shortLabelKey) })"
          :items="rowsByCategory[cat.key] || []"
          :loading="loading"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
