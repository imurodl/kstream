<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Show } from '../types'
import { getTrending, discoverKoreanTV } from '../services/tmdb'
import HeroSection from '../components/HeroSection.vue'
import ContentRow from '../components/ContentRow.vue'

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
      getTrending(),
      discoverKoreanTV({ genreId: '18' }),
      discoverKoreanTV({ genreId: '35' }),
      discoverKoreanTV({ sortBy: 'first_air_date.desc' }),
    ])

    trending.value = trendingRes.results
    heroShow.value = trendingRes.results[0] || null
    dramas.value = dramaRes.results
    comedy.value = comedyRes.results
    newReleases.value = newRes.results
  } catch (e) {
    error.value = 'Failed to load content. Please check your API key.'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Error state -->
    <div v-if="error" class="flex items-center justify-center min-h-[60vh] px-4">
      <div class="text-center">
        <p class="text-red-400 text-lg mb-2">{{ error }}</p>
        <p class="text-gray-500 text-sm">Make sure VITE_TMDB_ACCESS_TOKEN is set in your .env file.</p>
      </div>
    </div>

    <template v-else>
      <!-- Hero -->
      <div v-if="loading" class="w-full h-[70vh] min-h-[400px] max-h-[700px] bg-gray-900 animate-pulse" />
      <HeroSection v-else-if="heroShow" :show="heroShow" />

      <!-- Content rows -->
      <div class="mt-6 space-y-2">
        <ContentRow title="Trending Now" :shows="trending" :loading="loading" />
        <ContentRow title="Top Dramas" :shows="dramas" :loading="loading" />
        <ContentRow title="Comedy" :shows="comedy" :loading="loading" />
        <ContentRow title="New Releases" :shows="newReleases" :loading="loading" />
      </div>
    </template>
  </div>
</template>
