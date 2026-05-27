import React from 'react';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 items-center justify-center sm:justify-start">
      <button
        onClick={() => setActiveCategory('All')}
        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          activeCategory === 'All'
            ? 'bg-primary-600 text-white shadow-md scale-105'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeCategory === category
              ? 'bg-primary-600 text-white shadow-md scale-105'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-500'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
