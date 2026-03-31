<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Show } from '../types'
import { backdropUrl } from '../services/tmdb'

const { t } = useI18n()
const props = defineProps<{ show: Show }>()
const backdropFailed = ref(false)

const year = computed(() => props.show.first_air_date?.slice(0, 4) || '')
const rating = computed(() => props.show.vote_average?.toFixed(1))
const overview = computed(() => {
  const text = props.show.overview || ''
  return text.length > 200 ? text.slice(0, 200) + '...' : text
})
</script>

<template>
  <div class="relative w-full h-[70vh] min-h-[400px] max-h-[700px]">
    <img
      v-if="!backdropFailed"
      :src="backdropUrl(show.backdrop_path, 'original')"
      :alt="show.name"
      class="absolute inset-0 w-full h-full object-cover"
      @error="backdropFailed = true"
    />
    <div v-else class="absolute inset-0 bg-gray-900" />
    <div class="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
    <div class="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-[#0f0f0f]/30" />

    <div class="absolute inset-0 flex items-end pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-xl">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
          {{ show.name }}
        </h1>
        <div class="flex items-center gap-3 text-sm text-gray-300 mb-4">
          <span class="flex items-center gap-1 text-yellow-400 font-semibold">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {{ rating }}
          </span>
          <span>{{ year }}</span>
        </div>
        <p class="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
          {{ overview }}
        </p>
        <div class="flex gap-3">
          <RouterLink
            :to="{ name: 'player', params: { showId: show.id } }"
            class="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-md hover:bg-gray-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            {{ t('hero.watchNow') }}
          </RouterLink>
          <RouterLink
            :to="{ name: 'detail', params: { id: show.id } }"
            class="inline-flex items-center gap-2 bg-gray-600/50 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-gray-600/70 transition-colors"
          >
            {{ t('hero.moreInfo') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
