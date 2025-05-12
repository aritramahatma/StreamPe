import React from 'react';
import { Link } from 'wouter';
import { Movie, TVShow } from '@/lib/types';
import { getPosterUrl } from '@/lib/api';

interface SearchResultsProps {
  results: (Movie | TVShow)[];
  isLoading: boolean;
  onResultClick: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading,
  onResultClick 
}) => {
  const isMovie = (item: Movie | TVShow): item is Movie => 'title' in item;
  
  if (isLoading) {
    return (
      <div className="absolute top-12 left-0 right-0 z-50 bg-background border border-[#1f1f1f] rounded-b-lg shadow-lg max-h-[70vh] overflow-y-auto">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex bg-[#1f1f1f] rounded-lg overflow-hidden h-24 animate-pulse">
                <div className="w-16 bg-[#2a2a2a]" />
                <div className="p-3 flex-1">
                  <div className="h-5 w-3/4 bg-[#2a2a2a] rounded mb-2" />
                  <div className="h-4 w-1/2 bg-[#2a2a2a] rounded mb-2" />
                  <div className="h-4 w-1/3 bg-[#2a2a2a] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="absolute top-12 left-0 right-0 z-50 bg-background border border-[#1f1f1f] rounded-b-lg shadow-lg">
        <div className="p-4 text-center text-[#e0e0e0]">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-12 left-0 right-0 z-50 bg-background border border-[#1f1f1f] rounded-b-lg shadow-lg max-h-[70vh] overflow-y-auto">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item) => {
            const title = isMovie(item) ? item.title : item.name;
            const year = isMovie(item) 
              ? (item.release_date ? new Date(item.release_date).getFullYear() : '') 
              : (item.first_air_date ? new Date(item.first_air_date).getFullYear() : '');
            const mediaType = isMovie(item) ? 'movie' : 'tv';
            const genres = item.genre_ids?.map(id => id).join(', '); // TODO: Map genre IDs to names
            
            return (
              <Link key={item.id} href={`/${mediaType}/${item.id}`}>
                <a 
                  className="flex bg-[#1f1f1f] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition"
                  onClick={onResultClick}
                >
                  <img 
                    src={getPosterUrl(item.poster_path, 'small')} 
                    alt={title} 
                    className="w-16 h-24 object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-white">{title}</h3>
                    <div className="flex items-center text-xs text-[#e0e0e0] mt-1">
                      {year && <span>{year}</span>}
                      {year && <span className="mx-2">•</span>}
                      <div className="flex items-center">
                        <svg 
                          className="text-primary mr-1" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#e0e0e0] mt-1 line-clamp-1">
                      {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
                    </p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
