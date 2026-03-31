<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Show } from '../types'
import { discoverKoreanTV } from '../services/tmdb'
import { useWatchlistStore } from '../stores/watchlist'
import HeroSection from '../components/HeroSection.vue'
import ContentRow from '../components/ContentRow.vue'
import ContinueWatchingCard from '../components/ContinueWatchingCard.vue'

const { t } = useI18n()
const watchlistStore = useWatchlistStore()
const continueWatching = computed(() => watchlistStore.getContinueWatching())

const heroShow = ref<Show | null>(null)
const trending = ref<Show[]>([])
const dramas = ref<Show[]>([])
const comedy = ref<Show[]>([])
const newReleases = ref<Show[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const [trendingRes, dramaRes, comedyRes, newRes] = await Promise.all([
      discoverKoreanTV({ sortBy: 'popularity.desc' }),
      discoverKoreanTV({ genreId: '18' }),
      discoverKoreanTV({ genreId: '35' }),
      discoverKoreanTV({ sortBy: 'first_air_date.desc' }),
    ])

    const withPoster = (shows: Show[]) => shows.filter(s => s.poster_path)

    trending.value = withPoster(trendingRes.results)
    heroShow.value = trendingRes.results.find(s => s.backdrop_path) || null
    dramas.value = withPoster(dramaRes.results)
    comedy.value = withPoster(comedyRes.results)
    newReleases.value = withPoster(newRes.results)
  } catch (e) {
    error.value = t('home.errorLoad')
  } finally {
    loading.value = false
  }
})
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
      <HeroSection v-else-if="heroShow" :show="heroShow" />

      <section v-if="continueWatching.length" class="mt-6 mb-8">
        <h2 class="text-lg sm:text-xl font-semibold text-white mb-3 px-4 sm:px-6 lg:px-8">{{ t('home.continueWatching') }}</h2>
        <div class="flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scrollbar-hide">
          <ContinueWatchingCard
            v-for="item in continueWatching"
            :key="`${item.showId}-${item.episodeId}`"
            :item="item"
          />
        </div>
      </section>

      <div class="mt-6 space-y-2">
        <ContentRow :title="t('home.trending')" :shows="trending" :loading="loading" />
        <ContentRow :title="t('home.topDramas')" :shows="dramas" :loading="loading" />
        <ContentRow :title="t('home.comedy')" :shows="comedy" :loading="loading" />
        <ContentRow :title="t('home.newReleases')" :shows="newReleases" :loading="loading" />
      </div>
    </template>
  </div>
</template>
