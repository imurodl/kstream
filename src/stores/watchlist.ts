import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { WatchlistItem, PlaybackProgress, MediaType } from '../types'

function loadWatchlist(): WatchlistItem[] {
  const raw = JSON.parse(localStorage.getItem('kstream-watchlist') || '[]') as Partial<WatchlistItem>[]
  return raw.map(item => ({
    id: item.id!,
    name: item.name!,
    poster_path: item.poster_path ?? null,
    addedAt: item.addedAt ?? Date.now(),
    mediaType: item.mediaType ?? 'tv',
  }))
}

function loadProgress(): Record<string, PlaybackProgress> {
  const raw = JSON.parse(localStorage.getItem('kstream-progress') || '{}') as Record<string, Partial<PlaybackProgress>>
  const out: Record<string, PlaybackProgress> = {}
  for (const [key, val] of Object.entries(raw)) {
    out[key] = {
      showId: val.showId!,
      episodeId: val.episodeId ?? 0,
      currentTime: val.currentTime ?? 0,
      duration: val.duration ?? 0,
      updatedAt: val.updatedAt ?? Date.now(),
      showName: val.showName,
      posterPath: val.posterPath ?? null,
      episodeName: val.episodeName,
      mediaType: val.mediaType ?? 'tv',
    }
  }
  return out
}

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref<WatchlistItem[]>(loadWatchlist())
  const progress = ref<Record<string, PlaybackProgress>>(loadProgress())

  watch(items, (val) => localStorage.setItem('kstream-watchlist', JSON.stringify(val)), { deep: true })
  watch(progress, (val) => localStorage.setItem('kstream-progress', JSON.stringify(val)), { deep: true })

  function addToWatchlist(entry: Omit<WatchlistItem, 'addedAt'> & { addedAt?: number }) {
    if (!items.value.find((s) => s.id === entry.id && s.mediaType === entry.mediaType)) {
      items.value.push({ ...entry, addedAt: Date.now() })
    }
  }

  function removeFromWatchlist(id: number, mediaType?: MediaType) {
    items.value = items.value.filter((s) => mediaType ? !(s.id === id && s.mediaType === mediaType) : s.id !== id)
  }

  function isInWatchlist(id: number, mediaType?: MediaType): boolean {
    return items.value.some((s) => mediaType ? (s.id === id && s.mediaType === mediaType) : s.id === id)
  }

  function saveProgress(entry: PlaybackProgress) {
    const key = `${entry.mediaType}-${entry.showId}-${entry.episodeId}`
    progress.value[key] = { ...entry, updatedAt: Date.now() }
  }

  function getProgress(showId: number, episodeId: number, mediaType: MediaType = 'tv'): PlaybackProgress | null {
    return progress.value[`${mediaType}-${showId}-${episodeId}`] || null
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
