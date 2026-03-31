import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { WatchlistItem, PlaybackProgress } from '../types'

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref<WatchlistItem[]>(
    JSON.parse(localStorage.getItem('kstream-watchlist') || '[]')
  )
  const progress = ref<Record<string, PlaybackProgress>>(
    JSON.parse(localStorage.getItem('kstream-progress') || '{}')
  )

  watch(items, (val) => localStorage.setItem('kstream-watchlist', JSON.stringify(val)), { deep: true })
  watch(progress, (val) => localStorage.setItem('kstream-progress', JSON.stringify(val)), { deep: true })

  function addToWatchlist(show: WatchlistItem) {
    if (!items.value.find((s) => s.id === show.id)) {
      items.value.push({ ...show, addedAt: Date.now() })
    }
  }

  function removeFromWatchlist(showId: number) {
    items.value = items.value.filter((s) => s.id !== showId)
  }

  function isInWatchlist(showId: number): boolean {
    return items.value.some((s) => s.id === showId)
  }

  function saveProgress(entry: PlaybackProgress) {
    const key = `${entry.showId}-${entry.episodeId}`
    progress.value[key] = { ...entry, updatedAt: Date.now() }
  }

  function getProgress(showId: number, episodeId: number): PlaybackProgress | null {
    return progress.value[`${showId}-${episodeId}`] || null
  }

  function getContinueWatching(): PlaybackProgress[] {
    return Object.values(progress.value).sort((a, b) => b.updatedAt - a.updatedAt)
  }

  return {
    items,
    progress,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    saveProgress,
    getProgress,
    getContinueWatching,
  }
})
