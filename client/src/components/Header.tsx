import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import Logo from './ui/Logo';
import SearchResults from './SearchResults';
import { searchMulti } from '@/lib/api';
import { Movie, TVShow } from '@/lib/types';

const Header: React.FC = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (query.trim().length >= 2) {
      setIsSearching(true);
      // Debounce search to avoid too many API calls
      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await searchMulti(query);
          setSearchResults(results.results.slice(0, 6));
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Reset search when location changes
  useEffect(() => {
    setSearchQuery('');
    setShowResults(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-md">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/">
            <div className={`transition cursor-pointer ${location === '/' ? 'text-primary' : 'text-white hover:text-primary'}`}>
              Home
            </div>
          </Link>
          <Link href="/category/movie">
            <div className={`transition cursor-pointer ${location.includes('/category/movie') ? 'text-primary' : 'text-white hover:text-primary'}`}>
              Movies
            </div>
          </Link>
          <Link href="/category/tv">
            <div className={`transition cursor-pointer ${location.includes('/category/tv') ? 'text-primary' : 'text-white hover:text-primary'}`}>
              TV Shows
            </div>
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-2 sm:mr-4" ref={searchRef}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-[#1f1f1f] rounded-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary w-[140px] sm:w-64"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search movies and TV shows"
            />
            <svg
              className="absolute left-2.5 sm:left-3 top-1.5 sm:top-2 text-[#e0e0e0]"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            
            {/* Search Results Dropdown */}
            {showResults && (
              <SearchResults 
                results={searchResults} 
                isLoading={isSearching}
                onResultClick={() => setShowResults(false)}
              />
            )}
          </div>
          
          <button 
            className="md:hidden text-white hover:text-primary p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-[#181818] border-t border-[#2a2a2a]">
          <div className="flex flex-col space-y-2">
            <Link href="/">
              <div 
                className={`cursor-pointer py-2 px-3 rounded ${location === '/' ? 'text-primary bg-[#1f1f1f]' : 'text-white hover:bg-[#1f1f1f]'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </div>
            </Link>
            <Link href="/category/movie">
              <div 
                className={`cursor-pointer py-2 px-3 rounded ${location.includes('/category/movie') ? 'text-primary bg-[#1f1f1f]' : 'text-white hover:bg-[#1f1f1f]'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </div>
            </Link>
            <Link href="/category/tv">
              <div 
                className={`cursor-pointer py-2 px-3 rounded ${location.includes('/category/tv') ? 'text-primary bg-[#1f1f1f]' : 'text-white hover:bg-[#1f1f1f]'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                TV Shows
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
