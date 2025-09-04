import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  height?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  lines = 1, 
  height = 'h-4' 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton-shimmer ${height} mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-slide-in-up">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full skeleton-shimmer"></div>
      <div className="ml-3 flex-1">
        <SkeletonLoader height="h-4" />
        <SkeletonLoader height="h-3" className="mt-1" />
      </div>
    </div>
    <SkeletonLoader lines={2} />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slide-in-up">
    <div className="p-4 border-b">
      <SkeletonLoader height="h-6" className="w-1/3" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex justify-between items-center">
          <div className="flex-1">
            <SkeletonLoader height="h-4" className="w-2/3" />
            <SkeletonLoader height="h-3" className="w-1/2 mt-1" />
          </div>
          <SkeletonLoader height="h-4" className="w-20" />
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-slide-in-up">
    <div className="mb-4">
      <SkeletonLoader height="h-6" className="w-1/4" />
      <SkeletonLoader height="h-4" className="w-1/2 mt-2" />
    </div>
    <div className="h-64 bg-gray-100 rounded-lg skeleton-shimmer flex items-center justify-center">
      <div className="text-gray-400">Loading chart...</div>
    </div>
  </div>
);

export default SkeletonLoader;
