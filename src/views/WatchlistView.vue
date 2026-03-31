<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useWatchlistStore } from '../stores/watchlist'
import { posterUrl } from '../services/tmdb'

const { t } = useI18n()
const watchlistStore = useWatchlistStore()

function remove(showId: number) {
  watchlistStore.removeFromWatchlist(showId)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-white mb-6">{{ t('watchlist.title') }}</h1>

    <div v-if="watchlistStore.items.length === 0" class="text-center py-20">
      <svg class="w-16 h-16 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
      <p class="text-gray-400 text-lg mb-2">{{ t('watchlist.empty') }}</p>
      <p class="text-gray-600 text-sm mb-6">{{ t('watchlist.emptyHint') }}</p>
      <RouterLink
        to="/browse"
        class="inline-flex items-center gap-2 bg-purple-600 text-white font-medium px-6 py-2.5 rounded-md hover:bg-purple-700 transition-colors"
      >
        {{ t('watchlist.browseShows') }}
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <div
        v-for="item in watchlistStore.items"
        :key="item.id"
        class="group relative"
      >
        <RouterLink :to="{ name: 'detail', params: { id: item.id } }" class="block">
          <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
            <img
              :src="posterUrl(item.poster_path)"
              :alt="item.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
            {{ item.name }}
          </h3>
        </RouterLink>
        <button
          @click="remove(item.id)"
          class="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          :aria-label="t('watchlist.remove')"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
