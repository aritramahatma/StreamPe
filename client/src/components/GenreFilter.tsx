import React, { useState, useEffect } from 'react';
import { getGenres } from '@/lib/api';
import { Genre, MediaType } from '@/lib/types';
import { motion } from 'framer-motion';

interface GenreFilterProps {
  mediaType: MediaType;
  selectedGenreId?: number;
  onGenreSelect: (genreId?: number) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  mediaType, 
  selectedGenreId, 
  onGenreSelect 
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsLoading(true);
        const response = await getGenres(mediaType);
        setGenres(response.genres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGenres();
  }, [mediaType]);

  if (isLoading) {
    return (
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Browse by Genre</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="h-9 w-20 bg-[#1f1f1f] rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Browse by Genre</h2>
          <button 
            className="text-primary text-sm font-medium hover:underline"
            onClick={() => onGenreSelect(undefined)}
          >
            View All
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <motion.button 
            className={`px-4 py-2 ${!selectedGenreId ? 'bg-primary text-black' : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white'} font-medium rounded-full text-sm transition`}
            onClick={() => onGenreSelect(undefined)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          
          {genres.map((genre) => (
            <motion.button 
              key={genre.id}
              className={`px-4 py-2 ${selectedGenreId === genre.id ? 'bg-primary text-black' : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white'} font-medium rounded-full text-sm transition`}
              onClick={() => onGenreSelect(genre.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {genre.name}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreFilter;
