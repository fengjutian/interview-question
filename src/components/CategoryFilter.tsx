"use client";

import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
