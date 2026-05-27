import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      <div className="p-5 flex flex-col h-[200px]">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
