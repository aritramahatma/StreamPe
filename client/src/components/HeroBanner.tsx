import React from 'react';
import { Link } from 'wouter';
import { Movie, TVShow } from '@/lib/types';
import { getBackdropUrl } from '@/lib/api';
import { motion } from 'framer-motion';

interface HeroBannerProps {
  media: Movie | TVShow;
  mediaType: 'movie' | 'tv';
}

const HeroBanner: React.FC<HeroBannerProps> = ({ media, mediaType }) => {
  const title = mediaType === 'movie' ? (media as Movie).title : (media as TVShow).name;
  const releaseDate = mediaType === 'movie' 
    ? (media as Movie).release_date 
    : (media as TVShow).first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  // Format runtime (movies have runtime, TV shows have episode_run_time array)
  const runtime = mediaType === 'movie' 
    ? (media as Movie).runtime 
    : (media as TVShow).episode_run_time?.[0];
  
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={getBackdropUrl(media.backdrop_path, 'large')} 
          alt={`${title} backdrop`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      <div className="relative container mx-auto px-4 h-full flex items-end pb-16 md:pb-24">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <span className="bg-primary text-black font-bold px-2 py-1 text-xs rounded mr-3">NEW</span>
            <div className="flex items-center text-sm text-white">
              <svg 
                className="text-primary mr-1" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{media.vote_average.toFixed(1)}/10</span>
            </div>
            {releaseYear && (
              <>
                <span className="mx-2 text-[#e0e0e0]">•</span>
                <span className="text-sm text-[#e0e0e0]">{releaseYear}</span>
              </>
            )}
            {runtime && (
              <>
                <span className="mx-2 text-[#e0e0e0]">•</span>
                <span className="text-sm text-[#e0e0e0]">{formatRuntime(runtime)}</span>
              </>
            )}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          
          <p className="text-[#e0e0e0] mb-6 max-w-xl">
            {media.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link href={`/watch/${mediaType}/${media.id}`}>
              <div className="flex items-center bg-primary hover:bg-opacity-80 text-black font-semibold px-6 py-3 rounded-md transition cursor-pointer">
                <svg 
                  className="mr-2" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
                Watch Now
              </div>
            </Link>
            
            <Link href={`/${mediaType}/${media.id}`}>
              <div className="flex items-center bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white px-6 py-3 rounded-md transition cursor-pointer">
                <svg 
                  className="mr-2" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                More Info
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
