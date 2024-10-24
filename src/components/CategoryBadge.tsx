import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryBadgeProps {
  category: string;
  count?: number;
  active?: boolean;
}

export default function CategoryBadge({ category, count, active }: CategoryBadgeProps) {
  return (
    <Link
      to={`/category/${category.toLowerCase()}`}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
        active
          ? 'bg-blue-100 text-blue-800'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {category}
      {count !== undefined && (
        <span className="ml-2 text-xs bg-white px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}