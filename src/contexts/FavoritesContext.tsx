'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchFavorites } from '@/lib/api';

interface FavoritesContextType {
  favoritesCount: number;
  refreshFavorites: () => Promise<void>;
  incrementCount: () => void;
  decrementCount: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);

  const refreshFavorites = useCallback(async () => {
    if (!user) {
      setFavoritesCount(0);
      return;
    }
    try {
      const data = await fetchFavorites(user.uid);
      setFavoritesCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error('Error loading favorites count:', err);
    }
  }, [user]);

  const incrementCount = useCallback(() => {
    setFavoritesCount((prev) => prev + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setFavoritesCount((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  return (
    <FavoritesContext.Provider value={{ favoritesCount, refreshFavorites, incrementCount, decrementCount }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
