import React from 'react';

const Filters = ({
  categories,
  selectedCategory,
  priceRange,
  sortBy,
  onCategoryChange,
  onPriceChange,
  onSortChange,
  onClearFilters
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value="all"
              checked={selectedCategory === 'all'}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-700">All Categories</span>
          </label>
          
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => onPriceChange(e.target.value, priceRange.max)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => onPriceChange(priceRange.min, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600 text-center">
          Adjust filters to find your perfect products
        </p>
      </div>
    </div>
  );
};

export default Filters;