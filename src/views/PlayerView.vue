<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import type { ShowDetail, Episode } from '../types'
import { getTVShow, getSeasonEpisodes, backdropUrl } from '../services/tmdb'
import { getStreamForEpisode, getSubtitleTracks } from '../data/streams'
import { useWatchlistStore } from '../stores/watchlist'
import VideoPlayer from '../components/VideoPlayer.vue'
import EpisodeCard from '../components/EpisodeCard.vue'

const route = useRoute()
const router = useRouter()
const watchlistStore = useWatchlistStore()

const show = ref<ShowDetail | null>(null)
const episodes = ref<Episode[]>([])
const loading = ref(true)

const showId = computed(() => Number(route.params.showId))
const episodeId = computed(() => route.params.episodeId ? Number(route.params.episodeId) : null)

const currentEpisode = computed(() => {
  if (episodeId.value) {
    return episodes.value.find(ep => ep.id === episodeId.value) || episodes.value[0] || null
  }
  return episodes.value[0] || null
})

const currentIndex = computed(() => {
  if (!currentEpisode.value) return -1
  return episodes.value.findIndex(ep => ep.id === currentEpisode.value!.id)
})

const prevEpisode = computed(() => currentIndex.value > 0 ? episodes.value[currentIndex.value - 1] : null)
const nextEpisode = computed(() => currentIndex.value < episodes.value.length - 1 ? episodes.value[currentIndex.value + 1] : null)

const streamUrl = computed(() => {
  if (!currentEpisode.value) return ''
  return getStreamForEpisode(showId.value, currentEpisode.value.id)
})

const posterImage = computed(() => show.value ? backdropUrl(show.value.backdrop_path) : '')

const subtitles = getSubtitleTracks()

const savedProgress = computed(() => {
  if (!currentEpisode.value) return 0
  const p = watchlistStore.getProgress(showId.value, currentEpisode.value.id)
  return p?.currentTime || 0
})

function onTimeUpdate(currentTime: number, duration: number) {
  if (!currentEpisode.value) return
  watchlistStore.saveProgress({
    showId: showId.value,
    episodeId: currentEpisode.value.id,
    currentTime,
    duration,
    updatedAt: Date.now(),
    showName: show.value?.name,
    posterPath: show.value?.poster_path,
    episodeName: currentEpisode.value.name,
  })
}

function onEnded() {
  if (nextEpisode.value) {
    router.push({
      name: 'player',
      params: { showId: showId.value, episodeId: nextEpisode.value.id },
    })
  }
}

function navigateEpisode(episode: Episode) {
  router.push({
    name: 'player',
    params: { showId: showId.value, episodeId: episode.id },
  })
}

onMounted(async () => {
  try {
    show.value = await getTVShow(showId.value)
    if (show.value.seasons?.length) {
      const firstReal = show.value.seasons.find(s => s.season_number > 0) || show.value.seasons[0]
      const res = await getSeasonEpisodes(showId.value, firstReal.season_number)
      episodes.value = res.episodes
    }
  } catch (e) {
    // show failed to load
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="animate-pulse">
      <div class="w-full aspect-video bg-gray-900 max-h-[75vh]" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        <div class="h-6 w-64 bg-gray-800 rounded" />
        <div class="h-4 w-96 bg-gray-800/60 rounded" />
      </div>
    </div>

    <template v-else>
      <!-- Video Player -->
      <div class="w-full max-h-[75vh] bg-black">
        <VideoPlayer
          v-if="streamUrl"
          :key="streamUrl"
          :src="streamUrl"
          :poster="posterImage"
          :subtitles="subtitles"
          :start-time="savedProgress"
          @timeupdate="onTimeUpdate"
          @ended="onEnded"
        />
      </div>

      <!-- Content below player -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Episode info -->
          <div class="flex-1">
            <!-- Navigation -->
            <div class="flex items-center justify-between mb-4">
              <button
                v-if="prevEpisode"
                @click="navigateEpisode(prevEpisode)"
                class="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span v-else />
              <button
                v-if="nextEpisode"
                @click="navigateEpisode(nextEpisode)"
                class="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Next
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Current episode details -->
            <div v-if="currentEpisode">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm text-purple-400 font-medium">
                  Episode {{ currentEpisode.episode_number }}
                </span>
                <span v-if="currentEpisode.air_date" class="text-xs text-gray-500">
                  {{ currentEpisode.air_date }}
                </span>
              </div>
              <h1 class="text-2xl font-bold text-white mb-2">{{ currentEpisode.name }}</h1>
              <RouterLink
                :to="{ name: 'detail', params: { id: showId } }"
                class="text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                {{ show?.name }}
              </RouterLink>
              <p v-if="currentEpisode.overview" class="text-gray-400 mt-4 leading-relaxed">
                {{ currentEpisode.overview }}
              </p>
            </div>

            <!-- Keyboard shortcuts hint -->
            <div class="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <h3 class="text-sm font-medium text-gray-300 mb-2">Keyboard Shortcuts</h3>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span><kbd class="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> Play/Pause</span>
                <span><kbd class="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">←</kbd> <kbd class="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">→</kbd> Seek ±10s</span>
                <span><kbd class="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">F</kbd> Fullscreen</span>
                <span><kbd class="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">M</kbd> Mute</span>
              </div>
            </div>
          </div>

          <!-- Episode sidebar -->
          <div v-if="episodes.length > 1" class="lg:w-96 flex-shrink-0">
            <h2 class="text-lg font-semibold text-white mb-3">Episodes</h2>
            <div class="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              <div
                v-for="ep in episodes"
                :key="ep.id"
                :class="ep.id === currentEpisode?.id ? 'bg-purple-900/20 border-l-2 border-purple-500' : ''"
                class="rounded-r-lg"
              >
                <EpisodeCard :episode="ep" :show-id="showId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
