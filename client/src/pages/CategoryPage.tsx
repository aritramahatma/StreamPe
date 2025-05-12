import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Filter as FilterIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import GenreFilter from '@/components/GenreFilter';
import { getGenres, discoverMedia, trackAnalytics } from '@/lib/api';
import { Genre, Movie, TVShow, FilterOptions, MediaType } from '@/lib/types';

const CategoryPage: React.FC = () => {
  const [, params] = useRoute('/categories/:mediaType?');
  const [, setLocation] = useLocation();

  const mediaType: MediaType = (params?.mediaType as MediaType) || 'movie';
  const [location] = useLocation();
  const genreParam = new URLSearchParams(location.split('?')[1]).get('genre');
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(
    genreParam ? parseInt(genreParam) : undefined
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('popularity');

  const [media, setMedia] = useState<(Movie | TVShow)[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Track page view
        trackAnalytics({ 
          event: 'page_view',
          mediaType
        });

        // Fetch genres if not already loaded
        if (genres.length === 0) {
          const genresData = await getGenres(mediaType);
          setGenres(genresData.genres);
        }

        // Fetch media with filters
        const filterOptions: Partial<FilterOptions> = {
          sortBy,
        };

        if (selectedGenre) {
          filterOptions.genres = [selectedGenre];
        }

        if (selectedYear) {
          filterOptions.year = selectedYear;
        }

        const response = await discoverMedia(mediaType, filterOptions);
        setMedia(response.results);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mediaType, selectedGenre, selectedYear, sortBy]);

  const handleGenreSelect = (genreId?: number) => {
    setSelectedGenre(genreId);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value ? parseInt(e.target.value) : undefined;
    setSelectedYear(year);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as FilterOptions['sortBy']);
  };

  const handleMediaTypeChange = (type: MediaType) => {
    setLocation(`/categories/${type}`);
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1990; i--) {
      years.push(i);
    }
    return years;
  };

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">
          Browse {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
        </h1>

        {/* Media Type Toggle */}
        <div className="flex mb-6">
          <button 
            className={`px-4 py-2 ${mediaType === 'movie' ? 'bg-primary text-black' : 'bg-[#1f1f1f] text-white'} rounded-l-lg`}
            onClick={() => handleMediaTypeChange('movie')}
          >
            Movies
          </button>
          <button 
            className={`px-4 py-2 ${mediaType === 'tv' ? 'bg-primary text-black' : 'bg-[#1f1f1f] text-white'} rounded-r-lg`}
            onClick={() => handleMediaTypeChange('tv')}
          >
            TV Shows
          </button>
        </div>

        <GenreFilter 
          mediaType={mediaType}
          selectedGenreId={selectedGenre} 
          onGenreSelect={handleGenreSelect}
        />

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-2 px-4 rounded-lg transition">
                <FilterIcon size={18} />
                <span>Filters</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-[#1a1a1a] border-[#333]">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3">

                <div className="mb-4">
                  <label className="text-sm text-[#e0e0e0] mb-2 block">Release Year</label>
                  <select 
                    className="w-full bg-[#1f1f1f] text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-[#333]"
                    value={selectedYear || ''}
                    onChange={handleYearChange}
                  >
                    <option value="">All Years</option>
                    {getYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-[#e0e0e0] mb-2 block">Sort Results By</label>
                  <select 
                    className="w-full bg-[#1f1f1f] text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-[#333]"
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="popularity">Popularity</option>
                    <option value="vote_average">Rating (High to Low)</option>
                    <option value="release_date">Release Date (Newest)</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setSelectedYear(undefined);
                    setSortBy('popularity');
                    setSelectedGenre(undefined);
                  }}
                  className="w-full bg-[#2a2a2a] hover:bg-[#333] text-white py-2 px-3 rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, index) => (
              <div 
                key={index}
                className="h-[270px] bg-[#1f1f1f] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
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
            <h2 className="text-xl font-bold mb-2">{error}</h2>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-black px-4 py-2 rounded font-medium hover:bg-opacity-90 transition mt-4"
            >
              Retry
            </button>
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No {mediaType === 'movie' ? 'movies' : 'TV shows'} found with the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item) => (
              <MovieCard 
                key={item.id} 
                media={item} 
                mediaType={mediaType} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;