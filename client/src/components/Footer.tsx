import React from 'react';
import { Link } from 'wouter';
import Logo from './ui/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-background border-t border-[#1f1f1f]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <Logo className="mb-6 md:mb-0" />
          
          <div className="flex space-x-6">
            <Link href="/movies">
              <a className="text-[#e0e0e0] hover:text-primary transition">Movies</a>
            </Link>
            <Link href="/tv">
              <a className="text-[#e0e0e0] hover:text-primary transition">TV Shows</a>
            </Link>
            <Link href="/categories">
              <a className="text-[#e0e0e0] hover:text-primary transition">Genres</a>
            </Link>
            <Link href="/about">
              <a className="text-[#e0e0e0] hover:text-primary transition">About</a>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-[#1f1f1f] pt-6 text-center">
          <p className="text-sm text-[#e0e0e0]">
            StreamPe is a free movie streaming service. We do not store any media files on our server. All content is provided by non-affiliated third parties.
          </p>
          <p className="text-xs text-[#e0e0e0] mt-4">
            © {new Date().getFullYear()} StreamPe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
