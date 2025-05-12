import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import HeroBanner from '@/components/HeroBanner';
import ContentCarousel from '@/components/ContentCarousel';
import GenreFilter from '@/components/GenreFilter';
import { getTrending, getNowPlaying, getTopRated, getUpcoming, trackAnalytics } from '@/lib/api';
import { Movie, TVShow } from '@/lib/types';
import { SkeletonBanner, SkeletonCarousel, SkeletonGenres } from '@/components/SkeletonLoader';

const HomePage: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState({
    featured: true,
    trending: true,
    nowPlaying: true,
    topRated: true,
    upcoming: true,
  });
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Track page view
        trackAnalytics({ event: 'page_view' });
        
        // Fetch trending movies
        const trendingResponse = await getTrending('movie');
        setTrendingMovies(trendingResponse.results as Movie[]);
        
        // Pick a featured movie from trending
        const featured = trendingResponse.results[0] as Movie;
        setFeaturedMovie(featured);
        
        setLoading(prev => ({ ...prev, featured: false, trending: false }));
        
        // Fetch now playing movies
        const nowPlayingResponse = await getNowPlaying();
        setNowPlaying(nowPlayingResponse.results);
        setLoading(prev => ({ ...prev, nowPlaying: false }));
        
        // Fetch top rated movies
        const topRatedResponse = await getTopRated('movie');
        setTopRated(topRatedResponse.results as Movie[]);
        setLoading(prev => ({ ...prev, topRated: false }));
        
        // Fetch upcoming movies
        const upcomingResponse = await getUpcoming();
        setUpcoming(upcomingResponse.results);
        setLoading(prev => ({ ...prev, upcoming: false }));
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setLoading({
          featured: false,
          trending: false,
          nowPlaying: false,
          topRated: false,
          upcoming: false,
        });
      }
    };
    
    fetchData();
  }, []);
  
  const handleGenreSelect = (genreId?: number) => {
    setSelectedGenre(genreId);
  };

  return (
    <Layout fullWidth>
      {/* Hero Banner */}
      {loading.featured ? (
        <SkeletonBanner />
      ) : (
        featuredMovie && <HeroBanner media={featuredMovie} mediaType="movie" />
      )}
      
      {/* Content Carousels */}
      <ContentCarousel 
        title="Trending Now" 
        icon={
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
          </svg>
        } 
        media={trendingMovies} 
        mediaType="movie"
        isLoading={loading.trending}
      />

      {/* Genre Filter */}
      {loading.trending ? (
        <div className="py-4 container mx-auto px-4">
          <SkeletonGenres />
        </div>
      ) : (
        <GenreFilter 
          mediaType="movie"
          selectedGenreId={selectedGenre} 
          onGenreSelect={handleGenreSelect}
        />
      )}
      <ContentCarousel 
        title="Trending Now" 
        icon={
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
          </svg>
        } 
        media={trendingMovies} 
        mediaType="movie"
        isLoading={loading.trending}
      />
      
      <ContentCarousel 
        title="Now Playing" 
        icon={
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="10 8 16 12 10 16 10 8" />
          </svg>
        } 
        media={nowPlaying} 
        mediaType="movie"
        isLoading={loading.nowPlaying}
      />
      
      <ContentCarousel 
        title="Top Rated" 
        icon={
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
          </svg>
        } 
        media={topRated} 
        mediaType="movie"
        isLoading={loading.topRated}
      />
      
      <ContentCarousel 
        title="Coming Soon" 
        icon={
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        } 
        media={upcoming} 
        mediaType="movie"
        isLoading={loading.upcoming}
        upcomingStyle
      />
    </Layout>
  );
};

export default HomePage;
