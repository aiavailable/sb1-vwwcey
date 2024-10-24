import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ad } from '../types';
import { mockAds } from '../data/mockData';

interface AdState {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  createAd: (ad: Omit<Ad, 'id' | 'createdAt' | 'likes'>) => Promise<Ad>;
  updateAd: (id: string, updates: Partial<Ad>) => Promise<Ad>;
  deleteAd: (id: string) => Promise<boolean>;
  getAdById: (id: string) => Ad | undefined;
  getAdsByCategory: (category: string) => Ad[];
  getAdsByUser: (userId: string) => Ad[];
  toggleLike: (adId: string, userId: string) => Promise<void>;
}

export const useAdStore = create<AdState>()(
  persist(
    (set, get) => ({
      ads: [
        ...mockAds,
        {
          id: '3',
          title: 'Looking for Tennis Partner in Brisbane',
          description: 'Intermediate player looking for regular tennis matches in Brisbane area.',
          category: 'activities/sports',
          location: {
            city: 'Brisbane',
            neighborhood: 'New Farm',
            coordinates: {
              lat: -27.4698,
              lng: 153.0251
            }
          },
          userId: 'user_1678236',
          createdAt: '2024-03-14T08:00:00Z',
          images: [
            'https://images.unsplash.com/photo-1542144582-1ba00456b5e3',
          ],
          isPremium: true,
          isNSFW: false,
          likes: 2
        },
        {
          id: '4',
          title: 'Coffee and Conversation in Brisbane CBD',
          description: 'Looking to meet new people for casual coffee catchups in the city.',
          category: 'friendship/platonic',
          location: {
            city: 'Brisbane',
            neighborhood: 'Brisbane CBD',
            coordinates: {
              lat: -27.4698,
              lng: 153.0251
            }
          },
          userId: 'user_1678237',
          createdAt: '2024-03-13T14:30:00Z',
          images: [
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
          ],
          isPremium: false,
          isNSFW: false,
          likes: 4
        }
      ],
      loading: false,
      error: null,

      createAd: async (adData) => {
        set({ loading: true, error: null });
        try {
          const newAd: Ad = {
            ...adData,
            id: `ad_${Date.now()}`,
            createdAt: new Date().toISOString(),
            likes: 0
          };

          set(state => ({
            ads: [newAd, ...state.ads],
            loading: false
          }));

          return newAd;
        } catch (error) {
          set({ error: 'Failed to create ad', loading: false });
          throw error;
        }
      },

      updateAd: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const updatedAds = get().ads.map(ad =>
            ad.id === id ? { ...ad, ...updates } : ad
          );

          const updatedAd = updatedAds.find(ad => ad.id === id);
          if (!updatedAd) throw new Error('Ad not found');

          set({ ads: updatedAds, loading: false });
          return updatedAd;
        } catch (error) {
          set({ error: 'Failed to update ad', loading: false });
          throw error;
        }
      },

      deleteAd: async (id) => {
        set({ loading: true, error: null });
        try {
          set(state => ({
            ads: state.ads.filter(ad => ad.id !== id),
            loading: false
          }));
          return true;
        } catch (error) {
          set({ error: 'Failed to delete ad', loading: false });
          throw error;
        }
      },

      getAdById: (id) => {
        return get().ads.find(ad => ad.id === id);
      },

      getAdsByCategory: (category) => {
        const ads = get().ads;
        if (category === 'all') return ads;

        return ads.filter(ad => {
          const [mainCat, subCat] = category.split('/');
          const [adMainCat, adSubCat] = ad.category.split('/');

          if (subCat) {
            return adMainCat === mainCat && adSubCat === subCat;
          } else {
            return adMainCat === mainCat;
          }
        });
      },

      getAdsByUser: (userId) => {
        return get().ads.filter(ad => ad.userId === userId);
      },

      toggleLike: async (adId, userId) => {
        set({ loading: true, error: null });
        try {
          const ad = get().ads.find(a => a.id === adId);
          if (!ad) throw new Error('Ad not found');

          const updatedAd = {
            ...ad,
            likes: ad.likes + 1
          };

          set(state => ({
            ads: state.ads.map(a => a.id === adId ? updatedAd : a),
            loading: false
          }));
        } catch (error) {
          set({ error: 'Failed to update likes', loading: false });
          throw error;
        }
      }
    }),
    {
      name: 'ads-storage',
      partialize: (state) => ({ ads: state.ads })
    }
  )
);