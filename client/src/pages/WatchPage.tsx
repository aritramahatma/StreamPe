import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import VideoPlayer from '@/components/VideoPlayer';
import { getMovieDetails, getTVDetails, trackAnalytics } from '@/lib/api';
import { Movie, TVShow } from '@/lib/types';

const WatchPage: React.FC = () => {
  // Support two route patterns:
  // - /watch/movie/:id
  // - /watch/tv/:id/:season/:episode
  const [matchMovie, movieParams] = useRoute('/watch/movie/:id');
  const [matchTV, tvParams] = useRoute('/watch/tv/:id/:season/:episode');
  
  const [media, setMedia] = useState<Movie | TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mediaType = matchMovie ? 'movie' : 'tv';
  const mediaId = matchMovie 
    ? parseInt(movieParams?.id || '0') 
    : parseInt(tvParams?.id || '0');
  const seasonNumber = tvParams?.season ? parseInt(tvParams.season) : undefined;
  const episodeNumber = tvParams?.episode ? parseInt(tvParams.episode) : undefined;
  
  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!mediaId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Track play event
        trackAnalytics({ 
          event: 'play',
          mediaType,
          mediaId
        });
        
        if (mediaType === 'movie') {
          const movieData = await getMovieDetails(mediaId);
          setMedia(movieData);
        } else if (mediaType === 'tv') {
          const tvData = await getTVDetails(mediaId);
          setMedia(tvData);
        }
      } catch (error) {
        console.error(`Error fetching ${mediaType} details:`, error);
        setError(`Failed to load ${mediaType} details. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMediaDetails();
  }, [mediaId, mediaType]);
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <svg 
          className="animate-spin text-primary" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }
  
  if (error || !media) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="bg-[#1f1f1f] p-6 rounded-lg text-center max-w-md">
          <svg 
            className="mx-auto mb-4 text-primary" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Error Loading Video</h2>
          <p className="text-[#e0e0e0] mb-4">{error || 'Media not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-primary text-black px-4 py-2 rounded font-medium hover:bg-opacity-90 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const title = mediaType === 'movie' 
    ? (media as Movie).title 
    : (media as TVShow).name;
  
  return (
    <VideoPlayer 
      mediaType={mediaType}
      tmdbId={mediaId}
      title={title}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
      seasons={(media as TVShow).seasons}
    />
  );
};

export default WatchPage;
