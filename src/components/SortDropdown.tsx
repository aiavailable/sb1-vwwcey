import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full px-4 py-2 pr-8 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="distance">Distance</option>
      </select>
      <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  );
}