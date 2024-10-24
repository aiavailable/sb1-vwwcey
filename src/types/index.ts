export interface CityData {
  [state: string]: {
    [city: string]: {
      coordinates: {
        lat: number;
        lng: number;
      };
      suburbs: string[];
    };
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  isPremium: boolean;
  favorites: string[];
  preferences: UserPreferences;
  avatar?: string;
  advertiserProfile?: AdvertiserProfile;
}

export type UserRole = 'user' | 'advertiser' | 'admin';

export interface UserPreferences {
  ageRange: [number, number];
  categories: string[];
  location: string;
  maxDistance: number;
}

export interface AdvertiserProfile {
  businessName?: string;
  services: string[];
  verificationDocuments: string[];
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    city: string;
    neighborhood: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  userId: string;
  createdAt: string;
  images: string[];
  isPremium: boolean;
  isNSFW: boolean;
  likes: number;
}