import type { Ad } from '../types';

export const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Looking for friendship in Sydney',
    description: 'New to the area, seeking genuine connections and friendship.',
    category: 'friendship/platonic',
    location: {
      city: 'Sydney',
      neighborhood: 'Surry Hills',
      coordinates: {
        lat: -33.8847,
        lng: 151.2111
      }
    },
    userId: 'user_1678234',
    createdAt: '2024-03-15T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7',
    ],
    isPremium: true,
    isNSFW: false,
    likes: 5
  },
  {
    id: '2',
    title: 'Professional Massage Services',
    description: 'Licensed massage therapist offering relaxation and therapeutic massage.',
    category: 'services/massage',
    location: {
      city: 'Melbourne',
      neighborhood: 'South Yarra',
      coordinates: {
        lat: -37.8400,
        lng: 144.9933
      }
    },
    userId: 'user_1678235',
    createdAt: '2024-03-14T15:30:00Z',
    images: [
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1',
    ],
    isPremium: false,
    isNSFW: false,
    likes: 3
  }
];

// Add initial user information
export const initialUserInfo = {
  'user_1678234': {
    username: 'Sarah_SYD',
    joinDate: '2024-01-15T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    isVerified: true
  },
  'user_1678235': {
    username: 'WellnessTherapist',
    joinDate: '2024-02-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c',
    isVerified: true
  }
};