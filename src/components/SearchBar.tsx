import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocationStore } from '../store/locationStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();
  const { currentLocation, setLocation, clearLocation, getAvailableStates, getCitiesForState } = useLocationStore();
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const states = getAvailableStates();

  const handleLocationSelect = (state: string, city: string) => {
    setLocation({ state, city });
    setShowLocationPicker(false);
  };

  const handleClearLocation = () => {
    clearLocation();
    setShowLocationPicker(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowLocationPicker(!showLocationPicker)}
          className="w-full sm:w-48 px-4 py-2 pl-10 bg-white rounded-md border border-gray-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {currentLocation ? `${currentLocation.city}, ${currentLocation.state}` : 'All locations'}
        </button>

        {showLocationPicker && (
          <div className="absolute z-50 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={handleClearLocation}
                className="w-full px-2 py-1 text-sm text-left hover:bg-blue-50 rounded text-blue-600"
              >
                Show all locations
              </button>
            </div>
            {states.map(state => (
              <div key={state} className="border-b border-gray-100 last:border-0">
                <div className="px-4 py-2 bg-gray-50 font-medium text-sm text-gray-700">
                  {state}
                </div>
                <div className="p-2">
                  {getCitiesForState(state).map(city => (
                    <button
                      key={city}
                      onClick={() => handleLocationSelect(state, city)}
                      className="w-full px-2 py-1 text-sm text-left hover:bg-blue-50 rounded"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Search
      </button>
    </div>
  );
}