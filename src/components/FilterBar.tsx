import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterBar() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        <button className="text-sm text-blue-600 hover:text-blue-500">
          Reset all
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <label className="block text-gray-700 mb-1">Sort by</label>
          <select className="w-full border rounded-md px-2 py-1.5">
            <option>Newest first</option>
            <option>Oldest first</option>
            <option>Most relevant</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Distance</label>
          <select className="w-full border rounded-md px-2 py-1.5">
            <option>5 miles</option>
            <option>10 miles</option>
            <option>25 miles</option>
            <option>50 miles</option>
            <option>100 miles</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Show</label>
          <select className="w-full border rounded-md px-2 py-1.5">
            <option>All ads</option>
            <option>Premium only</option>
            <option>With photos</option>
            <option>Verified users</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <Filter className="w-4 h-4 mr-2" />
          More filters
        </button>
      </div>
    </div>
  );
}