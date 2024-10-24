import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Ad } from '../types';

export function useSearch() {
  const { searchQuery, setSearchQuery, filteredAds } = useApp();
  const [searchResults, setSearchResults] = useState<Ad[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  }, [setSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const results = filteredAds.filter(ad => 
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filteredAds]);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch
  };
}