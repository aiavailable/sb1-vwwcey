import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cityData } from '../data/suburbs';

interface Location {
  state: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationState {
  currentLocation: Location | null;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
  getAvailableStates: () => string[];
  getCitiesForState: (state: string) => string[];
  getSuburbsForCity: (state: string, city: string) => string[];
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      currentLocation: null,

      setLocation: (location) => {
        const coordinates = cityData[location.state]?.[location.city]?.coordinates;
        set({ 
          currentLocation: {
            ...location,
            coordinates: coordinates || undefined
          }
        });
      },

      clearLocation: () => {
        set({ currentLocation: null });
      },

      getAvailableStates: () => {
        return Object.keys(cityData);
      },

      getCitiesForState: (state) => {
        return Object.keys(cityData[state] || {});
      },

      getSuburbsForCity: (state, city) => {
        return cityData[state]?.[city]?.suburbs || [];
      }
    }),
    {
      name: 'location-storage'
    }
  )
);