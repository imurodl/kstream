export interface Show {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  first_air_date: string
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  popularity: number
}

export interface ShowDetail extends Show {
  genres: Genre[]
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  seasons: Season[]
  status: string
  tagline: string
}

export interface Season {
  id: number
  name: string
  overview: string
  season_number: number
  episode_count: number
  poster_path: string | null
  air_date: string
}

export interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  still_path: string | null
  air_date: string
  vote_average: number
  runtime: number | null
}

export interface Genre {
  id: number
  name: string
}

export interface Network {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface WatchlistItem {
  id: number
  name: string
  poster_path: string | null
  addedAt: number
}

export interface PlaybackProgress {
  showId: number
  episodeId: number
  currentTime: number
  duration: number
  updatedAt: number
  showName?: string
  posterPath?: string | null
  episodeName?: string
}
