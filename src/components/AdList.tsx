import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from './AdCard';
import { useApp } from '../context/AppContext';
import { useAdStore } from '../store/adStore';
import { useLocationStore } from '../store/locationStore';
import LoadingSpinner from './LoadingSpinner';
import { cityData } from '../data/suburbs';

export default function AdList() {
  const { selectedCategory, searchQuery } = useApp();
  const { ads, loading } = useAdStore();
  const { currentLocation } = useLocationStore();

  // Filter ads based on category, search query, and location
  const filteredAds = React.useMemo(() => {
    let filtered = ads;

    // Filter by location if selected
    if (currentLocation) {
      filtered = filtered.filter(ad => {
        // Check if the ad's location matches the selected location
        const locationMatches = 
          // Exact city match
          ad.location.city.toLowerCase() === currentLocation.city.toLowerCase() &&
          // Include suburbs/neighborhoods
          (!ad.location.neighborhood || 
            cityData[currentLocation.state]?.[currentLocation.city]?.suburbs
              .map(s => s.toLowerCase())
              .includes(ad.location.neighborhood.toLowerCase()));
        
        return locationMatches;
      });
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      const [mainCat, subCat] = selectedCategory.split('/');
      filtered = filtered.filter(ad => {
        const [adMainCat, adSubCat] = ad.category.split('/');
        if (subCat) {
          // If subcategory is selected, match both main and sub
          return adMainCat === mainCat && adSubCat === subCat;
        }
        // If only main category, match just the main category
        return adMainCat === mainCat;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(query) ||
        ad.description.toLowerCase().includes(query) ||
        ad.location.city.toLowerCase().includes(query) ||
        (ad.location.neighborhood && ad.location.neighborhood.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [ads, selectedCategory, searchQuery, currentLocation]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAds.length > 0 ? (
        filteredAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No listings found matching your criteria.</p>
          <Link
            to="/create-ad"
            className="mt-4 inline-block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            Create the first listing
          </Link>
        </div>
      )}
    </div>
  );
}