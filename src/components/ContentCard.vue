<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Show } from '../types'
import { posterUrl } from '../services/tmdb'

const props = defineProps<{ show: Show }>()

const year = computed(() => props.show.first_air_date?.slice(0, 4) || '')
const rating = computed(() => props.show.vote_average?.toFixed(1))
</script>

<template>
  <RouterLink
    :to="{ name: 'detail', params: { id: show.id } }"
    class="flex-shrink-0 w-40 sm:w-44 group cursor-pointer block"
  >
    <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
      <img
        :src="posterUrl(show.poster_path)"
        :alt="show.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {{ rating }}
      </div>
    </div>
    <h3 class="mt-2 text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
      {{ show.name }}
    </h3>
    <p class="text-xs text-gray-500">{{ year }}</p>
  </RouterLink>
</template>
