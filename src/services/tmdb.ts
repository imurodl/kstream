import type {
  Show, ShowDetail, Movie, MovieDetail, ContentItem, Episode, Genre,
  TMDBResponse, CastMember, CrewMember, PersonDetail, PersonCredit,
  VideoResult, MediaType,
} from '../types'
import { getCategory, STREAMING_FILTER, type CategoryKey } from '../config/categories'
import { tagResults } from '../utils/content'

const BASE_URL = 'https://api.themoviedb.org/3'
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN

export const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function posterUrl(path: string | null, size = 'w500'): string {
  if (!path) return '/placeholder-poster.svg'
  return `${IMAGE_BASE}/${size}${path}`
}

export function backdropUrl(path: string | null, size = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.svg'
  return `${IMAGE_BASE}/${size}${path}`
}

export function profileUrl(path: string | null, size = 'w185'): string {
  if (!path) return ''
  return `${IMAGE_BASE}/${size}${path}`
}

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
  return res.json()
}

// Korean TV networks on TMDB
export const NETWORKS = {
  KBS: '2',
  MBC: '86',
  SBS: '2141',
} as const

// ---------- Category-aware API ----------

export interface DiscoverParams {
  page?: number
  sortBy?: string
  genreId?: string
  networkId?: string
}

export async function discoverByCategory(
  categoryKey: CategoryKey,
  params: DiscoverParams = {},
): Promise<TMDBResponse<ContentItem>> {
  const category = getCategory(categoryKey)
  const endpoint = category.mediaType === 'movie' ? '/discover/movie' : '/discover/tv'
  const merged: Record<string, string> = {
    ...category.discoverParams,
    sort_by: params.sortBy || 'popularity.desc',
    page: String(params.page || 1),
    include_adult: 'false',
  }
  // Genre IDs from the category override the user-selected genre when both target the same field.
  if (params.genreId) {
    merged.with_genres = merged.with_genres
      ? `${merged.with_genres},${params.genreId}`
      : params.genreId
  }
  if (params.networkId && category.hasNetworks) {
    merged.with_networks = params.networkId
  }
  const res = await fetchTMDB<TMDBResponse<Show | Movie>>(endpoint, merged)
  const safe = res.results.filter(r => !(r as { adult?: boolean }).adult)
  return { ...res, results: tagResults(safe, category.mediaType) as ContentItem[] }
}

export async function searchByCategory(
  categoryKey: CategoryKey,
  query: string,
  page = 1,
): Promise<TMDBResponse<ContentItem>> {
  const category = getCategory(categoryKey)
  const endpoint = category.mediaType === 'movie' ? '/search/movie' : '/search/tv'
  const params: Record<string, string> = {
    query,
    page: String(page),
    include_adult: 'false',
  }
  if (category.searchLanguage) {
    params.with_original_language = category.searchLanguage
  }
  const res = await fetchTMDB<TMDBResponse<Show | Movie>>(endpoint, params)
  // /search doesn't accept with_original_language reliably — filter client-side too
  let filtered = res.results.filter(r => !(r as { adult?: boolean }).adult)
  if (category.searchLanguage) {
    filtered = filtered.filter(r => (r as Show | Movie).original_language === category.searchLanguage)
  }
  return { ...res, results: tagResults(filtered, category.mediaType) as ContentItem[] }
}

export async function getTrendingByCategory(categoryKey: CategoryKey): Promise<TMDBResponse<ContentItem>> {
  // /trending doesn't honor language filters, so we use /discover by popularity instead — guarantees on-category results.
  return discoverByCategory(categoryKey, { sortBy: 'popularity.desc' })
}

const genresCache = new Map<MediaType, Genre[]>()

export async function getGenresByCategory(categoryKey: CategoryKey): Promise<{ genres: Genre[] }> {
  const { mediaType } = getCategory(categoryKey)
  if (genresCache.has(mediaType)) {
    return { genres: genresCache.get(mediaType)! }
  }
  const endpoint = mediaType === 'movie' ? '/genre/movie/list' : '/genre/tv/list'
  const res = await fetchTMDB<{ genres: Genre[] }>(endpoint)
  genresCache.set(mediaType, res.genres)
  return res
}

export async function getDetail(mediaType: MediaType, id: number): Promise<ShowDetail | MovieDetail> {
  const endpoint = mediaType === 'movie' ? `/movie/${id}` : `/tv/${id}`
  return fetchTMDB<ShowDetail | MovieDetail>(endpoint)
}

export async function getCredits(mediaType: MediaType, id: number): Promise<{ cast: CastMember[]; crew: CrewMember[] }> {
  const endpoint = mediaType === 'movie' ? `/movie/${id}/credits` : `/tv/${id}/credits`
  return fetchTMDB<{ cast: CastMember[]; crew: CrewMember[] }>(endpoint)
}

export async function getRecommendationsByType(mediaType: MediaType, id: number): Promise<TMDBResponse<ContentItem>> {
  const endpoint = mediaType === 'movie' ? `/movie/${id}/recommendations` : `/tv/${id}/recommendations`
  const res = await fetchTMDB<TMDBResponse<Show | Movie>>(endpoint)
  return { ...res, results: tagResults(res.results, mediaType) as ContentItem[] }
}

export async function getVideos(mediaType: MediaType, id: number): Promise<{ results: VideoResult[] }> {
  const endpoint = mediaType === 'movie' ? `/movie/${id}/videos` : `/tv/${id}/videos`
  return fetchTMDB<{ results: VideoResult[] }>(endpoint)
}

// TV-only — kept as-is, called only from TV detail/player branch
export async function getSeasonEpisodes(showId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> {
  return fetchTMDB<{ episodes: Episode[] }>(`/tv/${showId}/season/${seasonNumber}`)
}

// ---------- Person ----------

export async function getPersonDetail(id: number): Promise<PersonDetail> {
  return fetchTMDB<PersonDetail>(`/person/${id}`)
}

export async function getPersonTVCredits(id: number): Promise<{ cast: PersonCredit[] }> {
  return fetchTMDB<{ cast: PersonCredit[] }>(`/person/${id}/tv_credits`)
}

// ---------- Watch providers ----------

interface WatchProvidersResponse {
  results: Record<string, { flatrate?: { provider_name: string }[] }>
}

export async function hasKRFlatrate(mediaType: MediaType, id: number): Promise<boolean> {
  try {
    const res = await fetchTMDB<WatchProvidersResponse>(`/${mediaType}/${id}/watch/providers`)
    return Boolean(res.results.KR?.flatrate?.length)
  } catch {
    return false
  }
}

/**
 * Filmography limited to titles available on KR subscription streaming — mirrors the
 * Browse allowlist so porn/erotica can't leak through. Movies come from /discover with
 * `with_cast` (one filtered call). TV has no working cast filter on /discover, so we pull
 * tv_credits and check KR flatrate per item in parallel.
 */
export async function getPersonFilmographyKR(personId: number): Promise<ContentItem[]> {
  const [moviesRes, tvCreditsRes] = await Promise.all([
    fetchTMDB<TMDBResponse<Movie>>('/discover/movie', {
      ...STREAMING_FILTER,
      with_cast: String(personId),
      sort_by: 'popularity.desc',
      include_adult: 'false',
    }),
    getPersonTVCredits(personId),
  ])

  const movies = tagResults(moviesRes.results, 'movie') as ContentItem[]

  // Dedupe TV credits by id (recurring roles list the same show multiple times),
  // cap at top 40 by popularity to bound the per-item provider fetches.
  const seen = new Set<number>()
  const topTv = tvCreditsRes.cast
    .filter(c => {
      if (!c.poster_path || seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 40)

  const flags = await Promise.all(topTv.map(c => hasKRFlatrate('tv', c.id)))
  const tv: ContentItem[] = topTv
    .filter((_, i) => flags[i])
    .map(c => ({
      id: c.id,
      name: c.name,
      original_name: c.name,
      overview: '',
      poster_path: c.poster_path,
      backdrop_path: null,
      vote_average: c.vote_average,
      vote_count: 0,
      first_air_date: c.first_air_date,
      genre_ids: [],
      origin_country: c.origin_country,
      original_language: c.original_language,
      popularity: c.popularity,
      media_type: 'tv',
    }))

  return [...movies, ...tv].sort((a, b) => b.popularity - a.popularity)
}

// ---------- Trailer helper ----------

export function getTrailerKey(videos: VideoResult[]): string | null {
  const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
    || videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
    || videos.find(v => v.site === 'YouTube' && v.type === 'Teaser')
    || videos.find(v => v.site === 'YouTube')
  return trailer?.key || null
}
