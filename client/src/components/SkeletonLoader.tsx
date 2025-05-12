import React from 'react';

interface SkeletonCardProps {
  size?: 'small' | 'medium' | 'large';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ size = 'medium' }) => {
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

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0 animate-pulse`}>
      <div className={`${heightClasses[size]} bg-[#1f1f1f] rounded-lg mb-2`}></div>
      <div className="h-4 bg-[#1f1f1f] rounded-md w-3/4 mb-2"></div>
      <div className="h-3 bg-[#1f1f1f] rounded-md w-1/2"></div>
    </div>
  );
};

export const SkeletonBanner: React.FC = () => {
  return (
    <div className="w-full h-[500px] sm:h-[600px] bg-gradient-to-r from-[#1a1a1a] to-[#1f1f1f] rounded-lg animate-pulse flex flex-col justify-end p-8">
      <div className="h-8 bg-[#2a2a2a] rounded-md w-1/3 mb-4"></div>
      <div className="h-4 bg-[#2a2a2a] rounded-md w-1/2 mb-2"></div>
      <div className="h-4 bg-[#2a2a2a] rounded-md w-2/3 mb-2"></div>
      <div className="h-4 bg-[#2a2a2a] rounded-md w-1/3 mb-6"></div>
      <div className="flex gap-4">
        <div className="h-12 bg-primary/30 rounded-md w-32"></div>
        <div className="h-12 bg-[#2a2a2a] rounded-md w-32"></div>
      </div>
    </div>
  );
};

export const SkeletonDetails: React.FC = () => {
  return (
    <div className="w-full animate-pulse bg-background rounded-lg overflow-hidden">
      <div className="w-full h-[400px] bg-[#1f1f1f]"></div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="h-12 bg-primary/30 rounded-lg w-40"></div>
          <div className="h-12 bg-[#1f1f1f] rounded-lg w-40"></div>
        </div>
        
        <div className="mb-8 bg-[#1a1a1a] p-5 rounded-lg">
          <div className="h-6 bg-[#2a2a2a] rounded-md w-1/4 mb-4"></div>
          <div className="h-4 bg-[#2a2a2a] rounded-md w-full mb-2"></div>
          <div className="h-4 bg-[#2a2a2a] rounded-md w-full mb-2"></div>
          <div className="h-4 bg-[#2a2a2a] rounded-md w-3/4"></div>
        </div>
        
        <div className="mb-8">
          <div className="h-6 bg-[#1f1f1f] rounded-md w-1/4 mb-4"></div>
          <div className="flex flex-wrap gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start mb-2">
                <div className="w-12 h-12 bg-[#1f1f1f] rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-[#1f1f1f] rounded-md w-32 mb-2"></div>
                  <div className="h-3 bg-[#1f1f1f] rounded-md w-24 mb-1"></div>
                  <div className="h-2 bg-[#1f1f1f] rounded-md w-48"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGenres: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-[#1f1f1f] rounded-md w-48"></div>
        <div className="h-4 bg-[#1f1f1f] rounded-md w-24"></div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-10 bg-[#1f1f1f] rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonCarousel: React.FC<{count?: number}> = ({ count = 6 }) => {
  return (
    <div className="w-full mb-8 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-[#1f1f1f] rounded-md w-48"></div>
        <div className="h-4 bg-[#1f1f1f] rounded-md w-24"></div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[...Array(count)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export const SkeletonVideoPlayer: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-pulse">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#2a2a2a] rounded-full mr-2"></div>
          <div className="h-5 bg-[#2a2a2a] rounded-md w-48"></div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-[#2a2a2a] rounded-full"></div>
          <div className="w-8 h-8 bg-[#2a2a2a] rounded-full"></div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-full sm:h-auto sm:max-w-5xl sm:aspect-video bg-[#1a1a1a] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
              <div className="h-5 bg-[#2a2a2a] rounded-md w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  SkeletonCard,
  SkeletonBanner,
  SkeletonDetails,
  SkeletonGenres,
  SkeletonCarousel,
  SkeletonVideoPlayer
};