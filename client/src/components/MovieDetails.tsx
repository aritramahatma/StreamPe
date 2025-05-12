import React from 'react';
import { Link } from 'wouter';
import { Movie, TVShow, Review, MediaType } from '@/lib/types';
import { getBackdropUrl, getPosterUrl } from '@/lib/api';
import CastList from './CastList';
import { motion } from 'framer-motion';

interface MovieDetailsProps {
  media: Movie | TVShow;
  mediaType: MediaType;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ media, mediaType }) => {
  const isMovie = mediaType === 'movie';
  const title = isMovie ? (media as Movie).title : (media as TVShow).name;
  const releaseDate = isMovie 
    ? (media as Movie).release_date 
    : (media as TVShow).first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  // Format runtime (movies have runtime, TV shows have episode_run_time array)
  const runtime = isMovie 
    ? (media as Movie).runtime 
    : (media as TVShow).episode_run_time?.[0];
  
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const trailerVideo = media.videos?.results.find(
    video => video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type)
  );
  
  const reviews = media.reviews?.results || [];

  return (
    <motion.div 
      className="bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Backdrop and header info */}
      <div className="relative h-96">
        <img 
          src={getBackdropUrl(media.backdrop_path, 'large')} 
          alt={`${title} backdrop`} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row items-end md:items-center">
          <img 
            src={getPosterUrl(media.poster_path, 'large')} 
            alt={`${title} poster`} 
            className="w-32 rounded-lg shadow-lg hidden md:block"
          />
          
          <div className="md:ml-6">
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <div className="flex flex-wrap items-center text-sm text-[#e0e0e0] mb-4">
              {releaseYear && <span>{releaseYear}</span>}
              
              {mediaType === 'tv' && (
                <>
                  <span className="mx-2">•</span>
                  <span>{(media as TVShow).number_of_seasons || 0} Season{(media as TVShow).number_of_seasons !== 1 ? 's' : ''}</span>
                </>
              )}
              
              {runtime && (
                <>
                  <span className="mx-2">•</span>
                  <span>{formatRuntime(runtime)}</span>
                </>
              )}
              
              <span className="mx-2">•</span>
              <div className="flex items-center text-sm">
                <svg 
                  className="text-primary mr-1" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-white font-medium">{media.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {media.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-[#1f1f1f] rounded-full text-xs">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <Link href={`/watch/${mediaType}/${media.id}${mediaType === 'tv' ? '/1/1' : ''}`}>
            <a className="flex-1 bg-primary hover:bg-opacity-80 text-black font-semibold py-3 rounded-md transition flex items-center justify-center">
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
            </a>
          </Link>
          
          {trailerVideo && (
            <a 
              href={`https://www.youtube.com/watch?v=${trailerVideo.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white px-4 py-3 rounded-md transition"
            >
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
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Trailer
            </a>
          )}
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Overview</h3>
          <p className="text-[#e0e0e0]">
            {media.overview}
          </p>
        </div>
        
        {/* Cast List */}
        {media.credits?.cast && media.credits.cast.length > 0 && (
          <CastList cast={media.credits.cast.slice(0, 10)} />
        )}
        
        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Reviews</h3>
            {reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="bg-[#1f1f1f] p-4 rounded-lg mb-4">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mr-3">
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
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">{review.author}</p>
                      {review.author_details?.rating && (
                        <div className="flex items-center ml-3">
                          {Array.from({ length: 5 }, (_, i) => (
                            <svg 
                              key={i}
                              className={i < Math.floor(review.author_details.rating / 2) ? 'text-primary' : 'text-[#e0e0e0]'}
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#e0e0e0]">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#e0e0e0]">
                  {review.content.length > 300 
                    ? `${review.content.substring(0, 300)}...` 
                    : review.content
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MovieDetails;
