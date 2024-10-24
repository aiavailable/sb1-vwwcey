import React from 'react';
import { Star } from 'lucide-react';

export default function PremiumBadge() {
  return (
    <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
      <Star className="w-3 h-3 mr-1" />
      Premium
    </div>
  );
}