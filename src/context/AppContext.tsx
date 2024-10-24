import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { useAdStore } from '../store/adStore';
import { useUserStore } from '../store/userStore';
import { useMessageStore } from '../store/messageStore';
import { storage } from '../utils/storage';

interface AppContextType {
  user: User | null;
  filteredAds: Ad[];
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    username: string;
    role: UserRole;
    businessName?: string;
  }) => Promise<void>;
  logout: () => void;
  toggleFavorite: (adId: string) => void;
  isFavorite: (adId: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { ads } = useAdStore();
  const { addProfile } = useUserStore();
  const { clearUserMessages, initializeSocket } = useMessageStore();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = storage.get('currentUser');
    return savedUser || null;
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAds, setFilteredAds] = useState(ads);

  // Initialize WebSocket connection when user is set
  useEffect(() => {
    if (user) {
      initializeSocket(user.id);
    }
  }, [user, initializeSocket]);

  const login = async (email: string, password: string) => {
    const userId = `user_${Date.now()}`;
    const newUser: User = {
      id: userId,
      username: email.split('@')[0],
      email,
      role: 'user',
      isVerified: true,
      isPremium: false,
      favorites: [],
      preferences: {
        ageRange: [18, 50],
        categories: [],
        location: 'Portland',
        maxDistance: 25
      }
    };
    
    addProfile(userId, {
      username: newUser.username,
      joinDate: new Date().toISOString(),
      isVerified: newUser.isVerified,
      avatar: undefined,
      phoneVerified: false,
      followers: [],
      following: []
    });

    setUser(newUser);
    storage.set('currentUser', newUser);
    initializeSocket(userId);
  };

  const signup = async (data: {
    email: string;
    password: string;
    username: string;
    role: UserRole;
    businessName?: string;
  }) => {
    const userId = `user_${Date.now()}`;
    const newUser: User = {
      id: userId,
      username: data.username,
      email: data.email,
      role: data.role,
      isVerified: false,
      isPremium: false,
      favorites: [],
      preferences: {
        ageRange: [18, 50],
        categories: [],
        location: 'Portland',
        maxDistance: 25
      },
      ...(data.role === 'advertiser' && {
        advertiserProfile: {
          businessName: data.businessName,
          services: [],
          verificationDocuments: []
        }
      })
    };

    addProfile(userId, {
      username: data.username,
      joinDate: new Date().toISOString(),
      isVerified: false,
      avatar: undefined,
      phoneVerified: false,
      followers: [],
      following: []
    });

    setUser(newUser);
    storage.set('currentUser', newUser);
    initializeSocket(userId);
  };

  const logout = () => {
    if (user) {
      clearUserMessages(user.id);
    }
    setUser(null);
    storage.remove('currentUser');
  };

  const toggleFavorite = (adId: string) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return prev;
      const favorites = prev.favorites.includes(adId)
        ? prev.favorites.filter(id => id !== adId)
        : [...prev.favorites, adId];
      const updatedUser = { ...prev, favorites };
      storage.set('currentUser', updatedUser);
      return updatedUser;
    });
  };

  const isFavorite = (adId: string) => {
    return user?.favorites.includes(adId) || false;
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    storage.set('currentUser', updatedUser);
  };

  useEffect(() => {
    const filtered = ads.filter(ad => {
      const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
      const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredAds(filtered);
  }, [ads, selectedCategory, searchQuery]);

  return (
    <AppContext.Provider
      value={{
        user,
        filteredAds,
        selectedCategory,
        searchQuery,
        setSelectedCategory,
        setSearchQuery,
        login,
        signup,
        logout,
        toggleFavorite,
        isFavorite,
        updateUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}