import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdStore } from '../store/adStore';
import CategoryFilter from '../components/CategoryFilter';
import AdList from '../components/AdList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLocationStore } from '../store/locationStore';

export default function Home() {
  const { ads, loading } = useAdStore();
  const { currentLocation } = useLocationStore();

  const locationDisplay = currentLocation ? `${currentLocation.city}, ${currentLocation.state}` : 'Australia';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="flex justify-between items-center py-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{locationDisplay} Connections</h2>
          <p className="mt-1 text-sm text-gray-600">
            {ads.length} {ads.length === 1 ? 'listing' : 'listings'} available
          </p>
        </div>
        <Link 
          to="/create-ad"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Post Ad
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <aside className="md:w-64 flex-shrink-0">
          <CategoryFilter />
        </aside>

        <section className="flex-1">
          <FilterBar />
          <AdList />
        </section>
      </div>
    </main>
  );
}