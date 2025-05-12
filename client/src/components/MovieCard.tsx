import React from 'react';
import { Link } from 'wouter';
import { Movie, TVShow } from '@/lib/types';
import { getPosterUrl } from '@/lib/api';
import { motion } from 'framer-motion';

interface MovieCardProps {
  media: Movie | TVShow;
  mediaType: 'movie' | 'tv';
  size?: 'small' | 'medium' | 'large';
  showInfo?: boolean;
  upcomingStyle?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  media, 
  mediaType, 
  size = 'medium',
  showInfo = true,
  upcomingStyle = false
}) => {
  const title = mediaType === 'movie' ? (media as Movie).title : (media as TVShow).name;
  const releaseDate = mediaType === 'movie' 
    ? (media as Movie).release_date 
    : (media as TVShow).first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  // Define sizes
  const sizeClasses = {
    small: 'w-[150px]',
    medium: 'w-[180px]',
    large: 'w-[220px]'
  };
  
  const heightClasses = {
    small: 'h-[225px]',
    medium: 'h-[270px]',
    large: 'h-[330px]'
  };

  if (upcomingStyle) {
    return (
      <div className="movie-card relative card-hover">
        <div className="relative">
          <img 
            src={getPosterUrl(media.poster_path, size === 'large' ? 'large' : 'medium')} 
            alt={title}
            className="w-full h-auto object-cover rounded-lg"
            loading="lazy"
          />
          <span className="absolute top-2 right-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded">SOON</span>
        </div>
        <div className="mt-2">
          <div className="flex items-center text-xs text-[#e0e0e0]">
            <span>{releaseDate}</span>
          </div>
          <h3 className="font-semibold text-sm mt-1">{title}</h3>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/${mediaType}/${media.id}`}>
      <a className={`movie-card relative flex-shrink-0 ${sizeClasses[size]} card-hover block`}>
        <img 
          src={getPosterUrl(media.poster_path, size === 'large' ? 'large' : 'medium')} 
          alt={title}
          className={`w-full ${heightClasses[size]} object-cover rounded-lg transform transition-transform duration-200`}
          loading="lazy"
          decoding="async"
          style={{ opacity: 0, transition: 'opacity 0.3s' }}
          onLoad={(e) => {
            e.currentTarget.classList.add('loaded');
            e.currentTarget.style.opacity = '1';
          }}
        />
        
        {showInfo && (
          <motion.div 
            className="movie-info opacity-0 absolute inset-0 bg-background/70 flex flex-col justify-end p-3 rounded-lg hover:opacity-100 transition-opacity duration-200"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center text-xs">
                <svg 
                  className="text-primary mr-1" 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{media.vote_average.toFixed(1)}</span>
              </div>
              <span className="text-xs">{releaseYear}</span>
            </div>
            <h3 className="font-semibold line-clamp-2">{title}</h3>
            <button className="mt-2 bg-primary/90 hover:bg-primary text-black text-sm font-semibold py-1 rounded flex items-center justify-center">
              <svg 
                className="mr-1" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
              Watch
            </button>
          </motion.div>
        )}
      </a>
    </Link>
  );
};

export default MovieCard;
