<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { PlaybackProgress } from '../types'
import { posterUrl } from '../services/tmdb'

const props = defineProps<{ item: PlaybackProgress }>()

const progressPercent = computed(() => {
  if (!props.item.duration) return 0
  return Math.min(100, Math.round((props.item.currentTime / props.item.duration) * 100))
})
</script>

<template>
  <RouterLink
    :to="{ name: 'player', params: { showId: item.showId, episodeId: item.episodeId } }"
    class="flex-shrink-0 w-56 sm:w-64 group cursor-pointer block"
  >
    <div class="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
      <img
        v-if="item.posterPath"
        :src="posterUrl(item.posterPath)"
        :alt="item.showName || ''"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      </div>

      <!-- Play overlay -->
      <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
      </div>

      <!-- Progress bar -->
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
        <div class="h-full bg-purple-500 transition-all" :style="{ width: `${progressPercent}%` }" />
      </div>
    </div>
    <h3 class="mt-2 text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
      {{ item.showName || 'Unknown Show' }}
    </h3>
    <p class="text-xs text-gray-500 truncate">
      {{ item.episodeName || `Episode` }}
    </p>
  </RouterLink>
</template>
