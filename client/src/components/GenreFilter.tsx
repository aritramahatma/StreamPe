import React, { useState, useEffect } from 'react';
import { getGenres } from '@/lib/api';
import { Genre, MediaType } from '@/lib/types';
import { motion } from 'framer-motion';
import { 
  FilmIcon, 
  Flame as FireIcon, 
  Music as MusicIcon, 
  Heart as HeartIcon, 
  FastForward as FastForwardIcon, 
  Tv as TvIcon, 
  Skull as SkullIcon, 
  Milestone as UtilityPoleIcon, 
  Ghost as GhostIcon, 
  Rocket as RocketIcon, 
  ThumbsUp as ThumbsUpIcon, 
  Umbrella as UmbrellaIcon,
  User as UserIcon,
  Users as UsersIcon,
  Disc as DiscIcon,
  Ticket as TheaterIcon,
  Lightbulb as LightbulbIcon,
  BookOpen as BookIcon
} from 'lucide-react';

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

  // Genre icon mapping
  const getGenreIcon = (genreId: number) => {
    switch(genreId) {
      case 28: // Action
        return <FireIcon size={18} />;
      case 12: // Adventure
        return <RocketIcon size={18} />;
      case 16: // Animation
        return <TheaterIcon size={18} />;
      case 35: // Comedy
        return <ThumbsUpIcon size={18} />;
      case 80: // Crime
        return <SkullIcon size={18} />;
      case 99: // Documentary
        return <BookIcon size={18} />;
      case 18: // Drama
        return <UserIcon size={18} />;
      case 10751: // Family
        return <UsersIcon size={18} />;
      case 14: // Fantasy
        return <GhostIcon size={18} />;
      case 36: // History
        return <BookIcon size={18} />;
      case 27: // Horror
        return <SkullIcon size={18} />;
      case 10402: // Music
        return <MusicIcon size={18} />;
      case 9648: // Mystery
        return <LightbulbIcon size={18} />;
      case 10749: // Romance
        return <HeartIcon size={18} />;
      case 878: // Science Fiction
        return <RocketIcon size={18} />;
      case 10770: // TV Movie
        return <TvIcon size={18} />;
      case 53: // Thriller
        return <FastForwardIcon size={18} />;
      case 10752: // War
        return <UtilityPoleIcon size={18} />;
      case 37: // Western
        return <UmbrellaIcon size={18} />;
      default:
        return <FilmIcon size={18} />;
    }
  };

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            <motion.button 
              className={`px-4 py-3 ${!selectedGenreId ? 'bg-primary text-black' : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white'} font-medium rounded-lg text-sm transition shadow-md flex items-center justify-center gap-2`}
              onClick={() => onGenreSelect(undefined)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FilmIcon size={18} />
              <span>All Genres</span>
            </motion.button>
            
            {genres
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((genre) => (
                <motion.button 
                  key={genre.id}
                  className={`p-3 ${selectedGenreId === genre.id ? 'bg-primary text-black' : 'bg-[#1f1f1f] hover:bg-[#2a2a2a] text-white'} rounded-lg transition shadow-md flex items-center justify-center`}
                  onClick={() => onGenreSelect(genre.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  title={genre.name}
                >
                  {getGenreIcon(genre.id)}
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
