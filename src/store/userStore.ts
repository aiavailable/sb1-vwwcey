import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  username: string;
  joinDate: string;
  avatar?: string;
  isVerified: boolean;
  phoneVerified: boolean;
  bio?: string;
  followers: string[];
  following: string[];
  location?: {
    state: string;
    city: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
  lastActive?: string;
}

interface UserState {
  profiles: Record<string, UserProfile>;
  addProfile: (userId: string, profile: UserProfile) => void;
  updateProfile: (userId: string, updates: Partial<UserProfile>) => void;
  getProfile: (userId: string) => UserProfile;
  followUser: (followerId: string, followingId: string) => void;
  unfollowUser: (followerId: string, followingId: string) => void;
  isFollowing: (followerId: string, followingId: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profiles: {
        'user_1678234': {
          username: 'Sarah_PDX',
          joinDate: '2024-01-15T00:00:00Z',
          isVerified: true,
          phoneVerified: true,
          bio: 'Adventure seeker and coffee enthusiast',
          followers: ['user_1678235'],
          following: [],
          location: {
            state: 'New South Wales',
            city: 'Sydney'
          },
          lastActive: new Date().toISOString()
        },
        'user_1678235': {
          username: 'WellnessTherapist',
          joinDate: '2024-02-01T00:00:00Z',
          isVerified: true,
          phoneVerified: true,
          bio: 'Licensed massage therapist with 5+ years experience',
          followers: [],
          following: ['user_1678234'],
          location: {
            state: 'Victoria',
            city: 'Melbourne'
          },
          socialLinks: {
            instagram: 'wellness_therapy',
            website: 'www.wellnesstherapy.com.au'
          },
          lastActive: new Date().toISOString()
        }
      },

      addProfile: (userId, profile) => {
        set(state => ({
          profiles: {
            ...state.profiles,
            [userId]: {
              ...profile,
              followers: profile.followers || [],
              following: profile.following || []
            }
          }
        }));
      },

      updateProfile: (userId, updates) => {
        set(state => {
          const currentProfile = state.profiles[userId];
          if (!currentProfile) return state;

          const updatedProfile = {
            ...currentProfile,
            ...updates,
            lastActive: new Date().toISOString()
          };

          // Update the user profile in local storage
          localStorage.setItem('currentUser', JSON.stringify({
            ...JSON.parse(localStorage.getItem('currentUser') || '{}'),
            ...updates,
            avatar: updates.avatar || currentProfile.avatar
          }));

          return {
            profiles: {
              ...state.profiles,
              [userId]: updatedProfile
            }
          };
        });
      },

      getProfile: (userId) => {
        const { profiles } = get();
        if (!profiles[userId]) {
          // Create a default profile if none exists
          const defaultProfile = {
            username: `User ${userId.split('_')[1] || userId}`,
            joinDate: new Date().toISOString(),
            isVerified: false,
            phoneVerified: false,
            followers: [],
            following: [],
            lastActive: new Date().toISOString()
          };
          get().addProfile(userId, defaultProfile);
          return defaultProfile;
        }
        return profiles[userId];
      },

      followUser: (followerId, followingId) => {
        set(state => ({
          profiles: {
            ...state.profiles,
            [followerId]: {
              ...state.profiles[followerId],
              following: [...state.profiles[followerId].following, followingId]
            },
            [followingId]: {
              ...state.profiles[followingId],
              followers: [...state.profiles[followingId].followers, followerId]
            }
          }
        }));
      },

      unfollowUser: (followerId, followingId) => {
        set(state => ({
          profiles: {
            ...state.profiles,
            [followerId]: {
              ...state.profiles[followerId],
              following: state.profiles[followerId].following.filter(id => id !== followingId)
            },
            [followingId]: {
              ...state.profiles[followingId],
              followers: state.profiles[followingId].followers.filter(id => id !== followerId)
            }
          }
        }));
      },

      isFollowing: (followerId, followingId) => {
        const { profiles } = get();
        return profiles[followerId]?.following.includes(followingId) || false;
      }
    }),
    {
      name: 'user-profiles',
      partialize: (state) => ({ profiles: state.profiles })
    }
  )
);