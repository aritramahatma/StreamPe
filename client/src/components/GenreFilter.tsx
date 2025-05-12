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
        
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
            <motion.button 
              className={`px-4 py-2 ${!selectedGenreId ? 'bg-primary text-black' : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white'} font-medium rounded-lg text-sm transition shadow-md`}
              onClick={() => onGenreSelect(undefined)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              All Genres
            </motion.button>
            
            {genres
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((genre) => (
                <motion.button 
                  key={genre.id}
                  className={`px-4 py-2 ${selectedGenreId === genre.id ? 'bg-primary text-black' : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white'} font-medium rounded-lg text-sm transition shadow-md flex items-center justify-center`}
                  onClick={() => onGenreSelect(genre.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {genre.name}
                </motion.button>
              ))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenreFilter;
