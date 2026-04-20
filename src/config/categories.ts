import type { MediaType } from '../types'

export type CategoryKey = 'k-tv' | 'k-movie' | 'k-variety' | 'j-drama' | 'c-drama' | 'anime'

export interface Category {
  key: CategoryKey
  labelKey: string
  shortLabelKey: string
  mediaType: MediaType
  /** Extra params merged into /discover requests */
  discoverParams: Record<string, string>
  /** Optional language filter for /search/{tv|movie} */
  searchLanguage?: string
  /** Whether the Korean network filter chips should appear on Browse */
  hasNetworks?: boolean
  /** Emoji used in the home discover strip */
  emoji: string
}

// TMDB genre IDs
const GENRE_ANIMATION = '16'
const GENRE_REALITY = '10764'
const GENRE_TALK = '10767'

// TMDB keyword IDs for erotica/softcore/adult — excluded from every discover call.
// include_adult=false only catches explicitly-flagged porn; these keywords cover the long tail
// (Japanese pinku, C-drama erotica, hentai) that still slips through KR flatrate providers.
const EXCLUDED_KEYWORDS = [
  '256466', // erotic
  '325693', // erotica
  '155477', // softcore
  '159551', // pink film
  '198385', // hentai
  '195669', // ecchi
  '320667', // adult film actress
  '341305', // japanese adult film actress
].join(',')

export const STREAMING_FILTER = {
  watch_region: 'KR',
  with_watch_monetization_types: 'flatrate',
  without_keywords: EXCLUDED_KEYWORDS,
  'vote_count.gte': '20',
} as const

export const CATEGORIES: readonly Category[] = [
  {
    key: 'k-tv',
    labelKey: 'category.kTv',
    shortLabelKey: 'category.kTvShort',
    mediaType: 'tv',
    discoverParams: {
      ...STREAMING_FILTER,
      with_original_language: 'ko',
      without_genres: GENRE_REALITY,
    },
    searchLanguage: 'ko',
    hasNetworks: true,
    emoji: '🇰🇷',
  },
  {
    key: 'k-movie',
    labelKey: 'category.kMovie',
    shortLabelKey: 'category.kMovieShort',
    mediaType: 'movie',
    discoverParams: {
      ...STREAMING_FILTER,
      with_original_language: 'ko',
    },
    searchLanguage: 'ko',
    emoji: '🎬',
  },
  {
    key: 'k-variety',
    labelKey: 'category.kVariety',
    shortLabelKey: 'category.kVarietyShort',
    mediaType: 'tv',
    discoverParams: {
      ...STREAMING_FILTER,
      with_original_language: 'ko',
      with_genres: `${GENRE_REALITY},${GENRE_TALK}`,
    },
    searchLanguage: 'ko',
    emoji: '🎤',
  },
  {
    key: 'j-drama',
    labelKey: 'category.jDrama',
    shortLabelKey: 'category.jDramaShort',
    mediaType: 'tv',
    discoverParams: {
      ...STREAMING_FILTER,
      with_original_language: 'ja',
      without_genres: GENRE_ANIMATION,
    },
    searchLanguage: 'ja',
    emoji: '🇯🇵',
  },
  {
    key: 'c-drama',
    labelKey: 'category.cDrama',
    shortLabelKey: 'category.cDramaShort',
    mediaType: 'tv',
    discoverParams: {
      ...STREAMING_FILTER,
      with_original_language: 'zh',
    },
    searchLanguage: 'zh',
    emoji: '🇨🇳',
  },
  {
    key: 'anime',
    labelKey: 'category.anime',
    shortLabelKey: 'category.animeShort',
    mediaType: 'tv',
    discoverParams: {
      ...STREAMING_FILTER,
      with_original_language: 'ja',
      with_genres: GENRE_ANIMATION,
    },
    searchLanguage: 'ja',
    emoji: '🌸',
  },
] as const

export function getCategory(key: CategoryKey): Category {
  const found = CATEGORIES.find(c => c.key === key)
  if (!found) throw new Error(`Unknown category: ${key}`)
  return found
}

export const DEFAULT_CATEGORY: CategoryKey = 'k-tv'
