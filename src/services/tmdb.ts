import type { Show, ShowDetail, Episode, Genre, TMDBResponse } from '../types'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(path: string | null, size = 'w500'): string {
  if (!path) return '/placeholder-poster.svg'
  return `${IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path: string | null, size = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.svg'
  return `${IMAGE_BASE}/${size}${path}`
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
  return res.json()
}

// Korean TV networks on TMDB
export const NETWORKS = {
  KBS: '2',
  MBC: '86',
  SBS: '2141',
} as const

export async function discoverKoreanTV(params: {
  page?: number
  sortBy?: string
  genreId?: string
  networkId?: string
} = {}): Promise<TMDBResponse<Show>> {
  return fetchTMDB<TMDBResponse<Show>>('/discover/tv', {
    with_original_language: 'ko',
    sort_by: params.sortBy || 'popularity.desc',
    page: String(params.page || 1),
    ...(params.genreId && { with_genres: params.genreId }),
    ...(params.networkId && { with_networks: params.networkId }),
  })
}

export async function getTVShow(id: number): Promise<ShowDetail> {
  return fetchTMDB<ShowDetail>(`/tv/${id}`)
}

export async function getSeasonEpisodes(showId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> {
  return fetchTMDB<{ episodes: Episode[] }>(`/tv/${showId}/season/${seasonNumber}`)
}

export async function searchTV(query: string, page = 1): Promise<TMDBResponse<Show>> {
  return fetchTMDB<TMDBResponse<Show>>('/search/tv', {
    query,
    page: String(page),
    with_original_language: 'ko',
  })
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  return fetchTMDB<{ genres: Genre[] }>('/genre/tv/list')
}

export async function getTrending(): Promise<TMDBResponse<Show>> {
  return fetchTMDB<TMDBResponse<Show>>('/trending/tv/week', {
    with_original_language: 'ko',
  })
}
