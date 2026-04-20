<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Episode } from '../types'

const props = defineProps<{
  episode: Episode
  showId: number
}>()

const stillUrl = computed(() => {
  if (!props.episode.still_path) return null
  return `https://image.tmdb.org/t/p/w400${props.episode.still_path}`
})

const overview = computed(() => {
  const text = props.episode.overview || ''
  return text.length > 120 ? text.slice(0, 120) + '...' : text
})

const runtime = computed(() => {
  if (!props.episode.runtime) return ''
  return `${props.episode.runtime}m`
})
</script>

<template>
  <RouterLink
    :to="{ name: 'player', params: { type: 'tv', id: showId, episodeId: episode.id } }"
    class="flex gap-4 p-3 rounded-lg hover:bg-gray-800/60 transition-colors group"
  >
    <!-- Thumbnail -->
    <div class="flex-shrink-0 w-40 sm:w-48 aspect-video rounded overflow-hidden bg-gray-800">
      <img
        v-if="stillUrl"
        :src="stillUrl"
        :alt="episode.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      </div>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0 py-1">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm text-gray-400">E{{ episode.episode_number }}</span>
        <h3 class="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
          {{ episode.name }}
        </h3>
      </div>
      <div class="flex items-center gap-3 text-xs text-gray-500 mb-2">
        <span v-if="episode.air_date">{{ episode.air_date }}</span>
        <span v-if="runtime">{{ runtime }}</span>
        <span v-if="episode.vote_average" class="text-yellow-500">★ {{ episode.vote_average.toFixed(1) }}</span>
      </div>
      <p v-if="overview" class="text-xs text-gray-500 leading-relaxed hidden sm:block">
        {{ overview }}
      </p>
    </div>
  </RouterLink>
</template>
