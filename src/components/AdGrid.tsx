import React from 'react';
import AdCard from './AdCard';
import { useApp } from '../context/AppContext';

export default function AdGrid() {
  const { filteredAds } = useApp();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredAds.length > 0 ? (
        filteredAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))
      ) : (
        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No listings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}