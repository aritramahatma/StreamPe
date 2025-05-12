import React from 'react';
import Layout from '@/components/Layout';
import { SkeletonDetails, SkeletonCarousel } from '@/components/SkeletonLoader';

const SkeletonMovieDetails: React.FC = () => {
  return (
    <Layout>
      <div className="mb-10">
        <SkeletonDetails />
      </div>
      
      <div className="container mx-auto px-4">
        <SkeletonCarousel count={8} />
      </div>
    </Layout>
  );
};

export default SkeletonMovieDetails;