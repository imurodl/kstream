<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Show } from '../types'
import { posterUrl } from '../services/tmdb'

const props = defineProps<{ show: Show }>()

const year = computed(() => props.show.first_air_date?.slice(0, 4) || '')
const rating = computed(() => props.show.vote_average?.toFixed(1))
const imgFailed = ref(false)

function onImgError() { imgFailed.value = true }
</script>

<template>
  <RouterLink
    :to="{ name: 'detail', params: { id: show.id } }"
    class="flex-shrink-0 w-40 sm:w-44 group cursor-pointer block"
  >
    <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
      <img
        v-if="!imgFailed"
        :src="posterUrl(show.poster_path)"
        :alt="show.name"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="onImgError"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
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
