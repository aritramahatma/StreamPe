import React from 'react';
import Layout from '@/components/Layout';
import { 
  SkeletonBanner, 
  SkeletonCarousel,
  SkeletonGenres
} from '@/components/SkeletonLoader';

const LoadingPage: React.FC = () => {
  return (
    <Layout fullWidth>
      {/* Skeleton Hero Banner */}
      <SkeletonBanner />
      
      {/* Skeleton Genre Filter */}
      <div className="py-4 container mx-auto px-4">
        <SkeletonGenres />
      </div>
      
      {/* Skeleton Content Carousels */}
      <div className="container mx-auto px-4">
        <SkeletonCarousel count={8} />
        <SkeletonCarousel count={8} />
        <SkeletonCarousel count={8} />
        <SkeletonCarousel count={12} />
      </div>
    </Layout>
  );
};

export default LoadingPage;