import type { ContentItem, ContentDetail, MediaType, Show, Movie } from '../types'

export function getTitle(item: { name?: string; title?: string }): string {
  return (item as Show).name ?? (item as Movie).title ?? ''
}

export function getOriginalTitle(item: { original_name?: string; original_title?: string }): string {
  return (item as Show).original_name ?? (item as Movie).original_title ?? ''
}

export function getReleaseDate(item: { first_air_date?: string; release_date?: string }): string {
  return (item as Show).first_air_date ?? (item as Movie).release_date ?? ''
}

export function getYear(item: { first_air_date?: string; release_date?: string }): string {
  return getReleaseDate(item).slice(0, 4)
}

/** Stamps a list of TMDB results with the media_type discriminator from the active category. */
export function tagResults<T extends { id: number }>(results: T[], mediaType: MediaType): (T & { media_type: MediaType })[] {
  return results.map(r => ({ ...r, media_type: mediaType }))
}

/**
 * Client-side porn filter. Mirrors the server-side STREAMING_FILTER for endpoints
 * that don't accept `without_keywords` (recommendations, combined_credits).
 * `adult` is unreliable on its own — TMDB under-tags softcore — so we also require a
 * minimum vote_count. Raise it for recommendation rows, lower it for a person's full filmography.
 */
export function isSafeContent(
  item: { adult?: boolean; vote_count?: number; poster_path?: string | null },
  minVotes = 3,
): boolean {
  if (item.adult) return false
  if (!item.poster_path) return false
  if ((item.vote_count ?? 0) < minVotes) return false
  return true
}

export function isMovie(item: ContentItem | ContentDetail): item is Extract<ContentItem | ContentDetail, { media_type: 'movie' }> {
  return item.media_type === 'movie'
}

export function isTv(item: ContentItem | ContentDetail): item is Extract<ContentItem | ContentDetail, { media_type: 'tv' }> {
  return item.media_type === 'tv'
}
