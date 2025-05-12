import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import Layout from '@/components/Layout';
import MovieDetails from '@/components/MovieDetails';
import ContentCarousel from '@/components/ContentCarousel';
import { getTVDetails, getRecommendations, trackAnalytics } from '@/lib/api';
import { TVShow } from '@/lib/types';
import { SkeletonDetails, SkeletonCarousel } from '@/components/SkeletonLoader';

const TVShowPage: React.FC = () => {
  const [, params] = useRoute('/tv/:id');
  const tvId = params?.id ? parseInt(params.id) : 0;
  
  const [tvShow, setTVShow] = useState<TVShow | null>(null);
  const [recommendations, setRecommendations] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTVDetails = async () => {
      if (!tvId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Track page view
        trackAnalytics({ 
          event: 'view',
          mediaType: 'tv',
          mediaId: tvId
        });
        
        // Fetch TV show details
        const tvData = await getTVDetails(tvId);
        setTVShow(tvData);
        
        // Fetch recommendations
        const recommendationsData = await getRecommendations('tv', tvId);
        setRecommendations(recommendationsData as TVShow[]);
      } catch (error) {
        console.error('Error fetching TV show details:', error);
        setError('Failed to load TV show details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTVDetails();
  }, [tvId]);
  
  if (loading) {
    return (
      <Layout fullWidth>
        <div className="mb-10">
          <SkeletonDetails />
        </div>
        
        <div className="container mx-auto px-4">
          <SkeletonCarousel count={8} />
        </div>
      </Layout>
    );
  }
  
  if (error || !tvShow) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center p-4">
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
            <h2 className="text-xl font-bold mb-2">Error Loading TV Show</h2>
            <p className="text-[#e0e0e0] mb-4">{error || 'TV show not found'}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-primary text-black px-4 py-2 rounded font-medium hover:bg-opacity-90 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullWidth>
      <MovieDetails media={tvShow} mediaType="tv" />
      
      {recommendations.length > 0 && (
        <ContentCarousel 
          title="You May Also Like" 
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
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
              <path d="M9 18h6" />
              <path d="M10 22h4" />
            </svg>
          } 
          media={recommendations} 
          mediaType="tv"
        />
      )}
    </Layout>
  );
};

export default TVShowPage;
