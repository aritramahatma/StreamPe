import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { getVideoEmbedUrl, trackAnalytics } from '@/lib/api';

interface VideoPlayerProps {
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  seasons?: { season_number: number, episode_count: number }[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  mediaType, 
  tmdbId, 
  title,
  seasonNumber,
  episodeNumber,
  seasons = []
}) => {
  const [, setLocation] = useLocation();
  const [currentSeason, setCurrentSeason] = useState(seasonNumber || 1);
  const [currentEpisode, setCurrentEpisode] = useState(episodeNumber || 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const videoSrc = getVideoEmbedUrl(
    mediaType, 
    tmdbId, 
    mediaType === 'tv' ? currentSeason : undefined, 
    mediaType === 'tv' ? currentEpisode : undefined
  );
  
  useEffect(() => {
    // Track analytics
    trackAnalytics({
      event: 'play',
      mediaType,
      mediaId: tmdbId,
    });
    
    // Reset error state when source changes
    setError(false);
    setLoading(true);
    
    // Handle iframe load/error events
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        setLoading(false);
      };
      
      const handleError = () => {
        setLoading(false);
        setError(true);
      };
      
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);
      
      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, [videoSrc, mediaType, tmdbId]);
  
  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = parseInt(e.target.value);
    setCurrentSeason(newSeason);
    setCurrentEpisode(1);
    
    if (mediaType === 'tv') {
      setLocation(`/watch/tv/${tmdbId}/${newSeason}/1`);
    }
  };
  
  const handleEpisodeClick = (episode: number) => {
    setCurrentEpisode(episode);
    
    if (mediaType === 'tv') {
      setLocation(`/watch/tv/${tmdbId}/${currentSeason}/${episode}`);
    }
  };
  
  const handleRetry = () => {
    setError(false);
    setLoading(true);
    
    if (iframeRef.current) {
      iframeRef.current.src = videoSrc;
    }
  };
  
  const handleGoBack = () => {
    window.history.back();
  };

  // Get current season's episode count
  const currentSeasonData = seasons.find(s => s.season_number === currentSeason);
  const episodeCount = currentSeasonData?.episode_count || 0;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center">
          <button 
            className="text-white hover:text-primary p-2"
            onClick={handleGoBack}
          >
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white font-medium ml-2">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="text-white hover:text-primary"
            onClick={() => {
              const iframe = iframeRef.current;
              if (iframe) {
                // Request fullscreen for the iframe
                if (iframe.requestFullscreen) {
                  iframe.requestFullscreen();
                }
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
          <button 
            className="text-white hover:text-primary"
            onClick={handleGoBack}
          >
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
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-full max-w-5xl aspect-video bg-background border border-[#1f1f1f] relative">
          {(loading || error) && (
            <div className="absolute inset-0 flex items-center justify-center">
              {loading && !error && (
                <div className="text-white flex flex-col items-center">
                  <svg
                    className="animate-spin text-primary mb-4"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <p>Loading video...</p>
                </div>
              )}
              
              {error && (
                <div className="text-yellow-400 bg-black p-6 rounded text-center max-w-md">
                  <svg
                    className="mx-auto mb-4"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <p className="text-lg font-semibold mb-2">⚠️ Unable to load the stream.</p>
                  <p className="text-sm mb-4">Please try again or check back later.</p>
                  <div className="flex gap-3 justify-center">
                    <button 
                      className="bg-[#1f1f1f] px-4 py-2 rounded text-white hover:bg-[#2a2a2a] transition"
                      onClick={handleRetry}
                    >
                      <svg
                        className="inline-block mr-1"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                      Retry
                    </button>
                    <Link href={`/${mediaType}/${tmdbId}`}>
                      <a className="bg-primary px-4 py-2 rounded text-black font-medium hover:bg-opacity-90 transition">
                        Watch Trailer
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={videoSrc}
            className={`w-full h-full ${loading || error ? 'opacity-0' : 'opacity-100'}`}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          ></iframe>
        </div>
      </div>
      
      {/* TV show episode selection */}
      {mediaType === 'tv' && seasons.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-[#1f1f1f] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Season {currentSeason}</h3>
            <div className="relative">
              <select 
                className="bg-[#1f1f1f] text-white py-2 pl-4 pr-10 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={currentSeason}
                onChange={handleSeasonChange}
              >
                {seasons
                  .filter(season => season.season_number > 0) // Filter out specials
                  .map(season => (
                    <option key={season.season_number} value={season.season_number}>
                      Season {season.season_number}
                    </option>
                  ))
                }
              </select>
              <svg
                className="absolute right-3 top-2.5 text-[#e0e0e0] pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {Array.from({ length: episodeCount }, (_, i) => i + 1).map(episode => (
              <button 
                key={episode}
                className={`${
                  currentEpisode === episode 
                    ? 'bg-primary text-black font-medium' 
                    : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white'
                } rounded p-2 text-sm transition`}
                onClick={() => handleEpisodeClick(episode)}
              >
                Ep {episode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
