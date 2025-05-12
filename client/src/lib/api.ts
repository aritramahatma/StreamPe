import {
  Movie,
  MovieResponse,
  TVShow,
  TVResponse,
  MediaType,
  MultiSearchResponse,
  StreamPeAnalytics,
  Genre,
  FilterOptions,
} from './types';

// Base URLs
const TMDB_API_URL = '/api/tmdb';
const STREAMPE_API_URL = '/api/streampe';

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || response.statusText || 'Unknown error';
    throw new Error(`API Error: ${response.status} - ${errorMessage}`);
  }
  return response.json() as Promise<T>;
};

// TMDb API functions
export const getTrending = async (mediaType: MediaType = 'movie', timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse | TVResponse> => {
  const response = await fetch(`${TMDB_API_URL}/trending/${mediaType}/${timeWindow}`);
  return handleResponse<MovieResponse | TVResponse>(response);
};

export const getNowPlaying = async (): Promise<MovieResponse> => {
  const response = await fetch(`${TMDB_API_URL}/movie/now_playing`);
  return handleResponse<MovieResponse>(response);
};

export const getUpcoming = async (): Promise<MovieResponse> => {
  const response = await fetch(`${TMDB_API_URL}/movie/upcoming`);
  return handleResponse<MovieResponse>(response);
};

export const getTopRated = async (mediaType: MediaType = 'movie'): Promise<MovieResponse | TVResponse> => {
  const response = await fetch(`${TMDB_API_URL}/${mediaType}/top_rated`);
  return handleResponse<MovieResponse | TVResponse>(response);
};

export const getPopular = async (mediaType: MediaType = 'movie'): Promise<MovieResponse | TVResponse> => {
  const response = await fetch(`${TMDB_API_URL}/${mediaType}/popular`);
  return handleResponse<MovieResponse | TVResponse>(response);
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const response = await fetch(`${TMDB_API_URL}/movie/${id}?append_to_response=videos,credits,reviews`);
  return handleResponse<Movie>(response);
};

export const getTVDetails = async (id: number): Promise<TVShow> => {
  const response = await fetch(`${TMDB_API_URL}/tv/${id}?append_to_response=videos,credits,reviews`);
  return handleResponse<TVShow>(response);
};

export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<any> => {
  const response = await fetch(`${TMDB_API_URL}/tv/${tvId}/season/${seasonNumber}`);
  return handleResponse(response);
};

export const searchMulti = async (query: string): Promise<MultiSearchResponse> => {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  const response = await fetch(`${TMDB_API_URL}/search/multi?query=${encodeURIComponent(query)}`);
  return handleResponse<MultiSearchResponse>(response);
};

export const getGenres = async (mediaType: MediaType = 'movie'): Promise<{ genres: Genre[] }> => {
  const response = await fetch(`${TMDB_API_URL}/genre/${mediaType}/list`);
  return handleResponse<{ genres: Genre[] }>(response);
};

export const discoverMedia = async (mediaType: MediaType, options: Partial<FilterOptions> = {}): Promise<MovieResponse | TVResponse> => {
  const params = new URLSearchParams();

  if (options.sortBy) {
    params.append('sort_by', options.sortBy === 'release_date' ? 'primary_release_date.desc' : `${options.sortBy}.desc`);
  }

  if (options.year) {
    if (mediaType === 'movie') {
      params.append('primary_release_year', options.year.toString());
    } else {
      params.append('first_air_date_year', options.year.toString());
    }
  }

  if (options.genres && options.genres.length > 0) {
    params.append('with_genres', options.genres.join(','));
  }

  const response = await fetch(`${TMDB_API_URL}/discover/${mediaType}?${params.toString()}`);
  return handleResponse<MovieResponse | TVResponse>(response);
};

// StreamPe API functions
export const trackAnalytics = async (data: StreamPeAnalytics): Promise<void> => {
  await fetch(`${STREAMPE_API_URL}/analytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getRecommendations = async (mediaType: MediaType, mediaId: number): Promise<Movie[] | TVShow[]> => {
  const response = await fetch(`${STREAMPE_API_URL}/recommendations?mediaType=${mediaType}&id=${mediaId}`);
  return handleResponse<Movie[] | TVShow[]>(response);
};

// Video source URLs
export function getVideoEmbedUrl(
  mediaType: MediaType,
  tmdbId: number,
  seasonNumber?: number,
  episodeNumber?: number
): string {
  const baseUrl = `https://multiembed.mov/directstream.php?video_id=${tmdbId}`;
  if (mediaType === 'tv' && seasonNumber && episodeNumber) {
    return `${baseUrl}&s=${seasonNumber}&e=${episodeNumber}`;
  }
  return `${baseUrl}&type=${mediaType}`;
}

// Movie image URLs
export const getPosterUrl = (path: string | null, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';

  const sizes = {
    small: 'w185',
    medium: 'w342',
    large: 'w500'
  };

  return `https://image.tmdb.org/t/p/${sizes[size]}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'small' | 'medium' | 'large' = 'large'): string => {
  if (!path) return 'https://via.placeholder.com/1280x720?text=No+Image';

  const sizes = {
    small: 'w780',
    medium: 'w1280',
    large: 'original'
  };

  return `https://image.tmdb.org/t/p/${sizes[size]}${path}`;
};

export const getProfileUrl = (path: string | null): string => {
  if (!path) return 'https://via.placeholder.com/185x278?text=No+Image';
  return `https://image.tmdb.org/t/p/w185${path}`;
};