<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { ShowDetail, Episode, CastMember, Show } from '../types'
import { getTVShow, getSeasonEpisodes, getShowCredits, getRecommendations, backdropUrl, posterUrl } from '../services/tmdb'
import { useWatchlistStore } from '../stores/watchlist'
import EpisodeCard from '../components/EpisodeCard.vue'
import CastCard from '../components/CastCard.vue'
import ContentCard from '../components/ContentCard.vue'

const { t } = useI18n()
const route = useRoute()
const watchlistStore = useWatchlistStore()

const show = ref<ShowDetail | null>(null)
const episodes = ref<Episode[]>([])
const cast = ref<CastMember[]>([])
const relatedShows = ref<Show[]>([])
const selectedSeason = ref(1)
const loading = ref(true)
const episodesLoading = ref(false)
const error = ref('')

const showId = computed(() => Number(route.params.id))
const inWatchlist = computed(() => show.value ? watchlistStore.isInWatchlist(show.value.id) : false)

const year = computed(() => show.value?.first_air_date?.slice(0, 4) || '')
const rating = computed(() => show.value?.vote_average?.toFixed(1) || '')
const genreNames = computed(() => show.value?.genres?.map(g => g.name).join(', ') || '')
const networkNames = computed(() => show.value?.networks?.map(n => n.name).join(', ') || '')

function toggleWatchlist() {
  if (!show.value) return
  if (inWatchlist.value) {
    watchlistStore.removeFromWatchlist(show.value.id)
  } else {
    watchlistStore.addToWatchlist({
      id: show.value.id,
      name: show.value.name,
      poster_path: show.value.poster_path,
      addedAt: Date.now(),
    })
  }
}

async function loadEpisodes(seasonNumber: number) {
  if (!show.value) return
  episodesLoading.value = true
  try {
    const res = await getSeasonEpisodes(show.value.id, seasonNumber)
    episodes.value = res.episodes
  } catch (e) {
    // episodes failed to load — show empty state
    episodes.value = []
  } finally {
    episodesLoading.value = false
  }
}

watch(selectedSeason, (s) => loadEpisodes(s))

onMounted(async () => {
  try {
    show.value = await getTVShow(showId.value)
    if (show.value.seasons?.length) {
      const firstReal = show.value.seasons.find(s => s.season_number > 0) || show.value.seasons[0]
      selectedSeason.value = firstReal.season_number
    }
    await loadEpisodes(selectedSeason.value)

    // Fetch cast and recommendations in parallel
    const [creditsRes, recsRes] = await Promise.all([
      getShowCredits(showId.value).catch(() => ({ cast: [] })),
      getRecommendations(showId.value).catch(() => ({ results: [] })),
    ])
    cast.value = creditsRes.cast.slice(0, 20)
    relatedShows.value = recsRes.results.filter((s: Show) => s.poster_path).slice(0, 12)
  } catch (e) {
    error.value = t('detail.errorLoad')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="animate-pulse">
      <div class="w-full h-[50vh] bg-gray-900" />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div class="h-8 w-64 bg-gray-800 rounded" />
        <div class="h-4 w-96 bg-gray-800 rounded" />
        <div class="h-4 w-80 bg-gray-800/60 rounded" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
      <p class="text-red-400 text-lg">{{ error }}</p>
    </div>

    <!-- Content -->
    <template v-else-if="show">
      <!-- Backdrop -->
      <div class="relative w-full h-[50vh] min-h-[350px]">
        <img
          :src="backdropUrl(show.backdrop_path, 'original')"
          :alt="show.name"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-[#0f0f0f]/40" />
      </div>

      <!-- Show info -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div class="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <!-- Poster -->
          <div class="flex-shrink-0 w-48 sm:w-56 mx-auto sm:mx-0">
            <img
              :src="posterUrl(show.poster_path)"
              :alt="show.name"
              class="w-full rounded-lg shadow-2xl"
            />
          </div>

          <!-- Info -->
          <div class="flex-1 pt-4 sm:pt-12">
            <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">{{ show.name }}</h1>
            <p v-if="show.tagline" class="text-gray-400 italic mb-3">{{ show.tagline }}</p>

            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
              <span class="flex items-center gap-1 text-yellow-400 font-semibold">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {{ rating }}
              </span>
              <span>{{ year }}</span>
              <span v-if="networkNames">{{ networkNames }}</span>
              <span>{{ show.number_of_seasons }} {{ t('detail.season') }}</span>
              <span>{{ show.status }}</span>
            </div>

            <p v-if="genreNames" class="text-sm text-gray-500 mb-4">{{ genreNames }}</p>

            <p class="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 max-w-2xl">
              {{ show.overview }}
            </p>

            <!-- Actions -->
            <div class="flex gap-3">
              <RouterLink
                :to="{ name: 'player', params: { showId: show.id } }"
                class="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-md hover:bg-gray-200 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                {{ t('detail.watchNow') }}
              </RouterLink>
              <button
                @click="toggleWatchlist"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold transition-colors"
                :class="inWatchlist
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-600/50 text-white hover:bg-gray-600/70'"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="inWatchlist" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {{ inWatchlist ? t('detail.inWatchlist') : t('detail.addWatchlist') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast section -->
      <div v-if="cast.length" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h2 class="text-xl font-semibold text-white mb-4">{{ t('detail.cast') }}</h2>
        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <CastCard v-for="member in cast" :key="member.id" :cast="member" />
        </div>
      </div>

      <!-- Related Shows -->
      <div v-if="relatedShows.length" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h2 class="text-xl font-semibold text-white mb-4">{{ t('detail.relatedShows') }}</h2>
        <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <ContentCard
            v-for="s in relatedShows"
            :key="s.id"
            :show="s"
          />
        </div>
      </div>

      <!-- Episodes section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-white">{{ t('detail.episodes') }}</h2>
          <select
            v-if="show.seasons && show.seasons.length > 1"
            v-model="selectedSeason"
            class="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700 outline-none focus:border-purple-500"
          >
            <option
              v-for="season in show.seasons.filter(s => s.season_number > 0)"
              :key="season.id"
              :value="season.season_number"
            >
              {{ season.name }}
            </option>
          </select>
        </div>

        <!-- Episodes loading -->
        <div v-if="episodesLoading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex gap-4 p-3 animate-pulse">
            <div class="flex-shrink-0 w-40 sm:w-48 aspect-video bg-gray-800 rounded" />
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 w-48 bg-gray-800 rounded" />
              <div class="h-3 w-32 bg-gray-800/60 rounded" />
              <div class="h-3 w-full bg-gray-800/40 rounded hidden sm:block" />
            </div>
          </div>
        </div>

        <!-- Episodes list -->
        <div v-else-if="episodes.length" class="space-y-1">
          <EpisodeCard
            v-for="ep in episodes"
            :key="ep.id"
            :episode="ep"
            :show-id="show.id"
          />
        </div>

        <p v-else class="text-gray-500 text-center py-8">{{ t('detail.noEpisodes') }}</p>
      </div>
    </template>
  </div>
</template>
