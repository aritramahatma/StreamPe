import React, { useRef } from 'react';
import { Movie, TVShow } from '@/lib/types';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';
import { SkeletonCard, SkeletonCarousel } from './SkeletonLoader';

interface ContentCarouselProps {
  title: string;
  icon?: React.ReactNode;
  media: (Movie | TVShow)[];
  mediaType: 'movie' | 'tv';
  isLoading?: boolean;
  upcomingStyle?: boolean;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ 
  title, 
  icon, 
  media, 
  mediaType, 
  isLoading = false,
  upcomingStyle = false
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  if (isLoading) {
    return (
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <SkeletonCarousel count={upcomingStyle ? 12 : 8} />
        </div>
      </section>
    );
  }
  
  if (upcomingStyle) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-white">{title}</span>
            {icon && <span className="ml-2 text-primary">{icon}</span>}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {media.map((item) => (
              <MovieCard 
                key={item.id} 
                media={item} 
                mediaType={mediaType} 
                upcomingStyle
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-white">{title}</span>
          {icon && <span className="ml-2 text-primary">{icon}</span>}
        </h2>
        
        <div className="relative">
          <motion.button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-white p-3 rounded-full shadow-lg"
            onClick={() => scroll('left')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>
          
          <div ref={carouselRef} className="carousel flex overflow-x-auto gap-4 pb-4 scroll-smooth">
            {media.map((item) => (
              <MovieCard 
                key={item.id} 
                media={item} 
                mediaType={mediaType} 
              />
            ))}
          </div>
          
          <motion.button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background text-white p-3 rounded-full shadow-lg"
            onClick={() => scroll('right')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ContentCarousel;
