// TMDb API Types
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  genres?: Genre[];
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  reviews?: {
    results: Review[];
  };
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  reviews?: {
    results: Review[];
  };
  seasons?: Season[];
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details?: {
    rating: number;
    avatar_path: string | null;
    username: string;
  }
}

// API Response Types
export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface TVResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface MultiSearchResponse {
  page: number;
  results: (Movie | TVShow)[];
  total_pages: number;
  total_results: number;
}

// StreamPe API Types
export interface StreamPeRecommendation {
  id: number;
  mediaType: 'movie' | 'tv';
  reason: string;
}

export interface StreamPeAnalytics {
  event: string;
  mediaType?: 'movie' | 'tv';
  mediaId?: number;
  query?: string;
}

// App Types
export type MediaType = 'movie' | 'tv';

export interface WatchProgress {
  mediaId: number;
  mediaType: MediaType;
  progress: number; // seconds
  duration: number; // seconds
  title: string;
  posterPath: string | null;
}

export interface FilterOptions {
  sortBy: 'popularity' | 'vote_average' | 'release_date';
  year?: number;
  genres?: number[];
}
