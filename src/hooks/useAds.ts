import { useState, useCallback } from 'react';
import { useAdStore } from '../store/adStore';
import type { Ad } from '../types';

export function useAds() {
  const {
    ads,
    loading: storeLoading,
    error: storeError,
    createAd,
    updateAd,
    deleteAd,
    getAdById,
    getAdsByCategory,
    getAdsByUser,
    toggleLike
  } = useAdStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAd = useCallback(async (adData: Omit<Ad, 'id' | 'userId' | 'createdAt' | 'likes'>) => {
    setLoading(true);
    setError(null);
    try {
      const newAd = await createAd(adData);
      return newAd;
    } catch (err) {
      setError('Failed to create ad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createAd]);

  const handleUpdateAd = useCallback(async (id: string, updates: Partial<Ad>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAd = await updateAd(id, updates);
      return updatedAd;
    } catch (err) {
      setError('Failed to update ad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateAd]);

  const handleDeleteAd = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAd(id);
      return true;
    } catch (err) {
      setError('Failed to delete ad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteAd]);

  const handleToggleLike = useCallback(async (adId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await toggleLike(adId, userId);
    } catch (err) {
      setError('Failed to update like');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toggleLike]);

  return {
    ads,
    loading: loading || storeLoading,
    error: error || storeError,
    createAd: handleCreateAd,
    updateAd: handleUpdateAd,
    deleteAd: handleDeleteAd,
    getAdById,
    getAdsByCategory,
    getAdsByUser,
    toggleLike: handleToggleLike
  };
}