import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  category: string;
  distance: number;
  sortBy: string;
  priceRange: [number, number];
  datePosted: string;
  hasPhotos: boolean;
  verifiedOnly: boolean;
}

export default function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    distance: 25,
    sortBy: 'recent',
    priceRange: [0, 1000],
    datePosted: 'anytime',
    hasPhotos: false,
    verifiedOnly: false
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search listings..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Search</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="casual">Casual Dating</option>
                <option value="long-term">Long-term Relationship</option>
                <option value="friendship">Friendship</option>
                <option value="activities">Activities</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <select
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>Within 5 miles</option>
                <option value={10}>Within 10 miles</option>
                <option value={25}>Within 25 miles</option>
                <option value={50}>Within 50 miles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Posted
              </label>
              <select
                value={filters.datePosted}
                onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="anytime">Anytime</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasPhotos"
                  checked={filters.hasPhotos}
                  onChange={(e) => handleFilterChange('hasPhotos', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hasPhotos" className="ml-2 text-sm text-gray-700">
                  Has Photos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="verifiedOnly" className="ml-2 text-sm text-gray-700">
                  Verified Only
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                onClick={() => setFilters({
                  category: 'all',
                  distance: 25,
                  sortBy: 'recent',
                  priceRange: [0, 1000],
                  datePosted: 'anytime',
                  hasPhotos: false,
                  verifiedOnly: false
                })}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Reset
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}