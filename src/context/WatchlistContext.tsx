import React, { createContext, useContext, useState, useEffect } from 'react';
import { TopGainers, TopLosers, Watchlist } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLISTS_STORAGE_KEY = 'WATCHLISTS_STORAGE_KEY';

interface WatchlistContextProps {
  watchlists: Watchlist[];
  addWatchlist: (name: string) => string;
  addStockToWatchlist: (watchlistId: string, stock: TopGainers | TopLosers) => void;
  removeStockFromWatchlist: (watchlistId: string, symbol: string) => void;
  removeWatchlist: (watchlistId: string) => void;
}

const WatchlistContext = createContext<WatchlistContextProps | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlists from AsyncStorage on mount
  useEffect(() => {
    const loadWatchlists = async () => {
      try {
        const data = await AsyncStorage.getItem(WATCHLISTS_STORAGE_KEY);
        if (data) {
          setWatchlists(JSON.parse(data));
        }
      } catch (e) {
        console.error('Failed to load watchlists', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWatchlists();
  }, []);

  // Save watchlists to AsyncStorage whenever they change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(WATCHLISTS_STORAGE_KEY, JSON.stringify(watchlists)).catch(e => {
      console.error('Failed to save watchlists', e);
    });
  }, [watchlists, isLoaded]);

  const addWatchlist = (name: string): string => {
    const newId = Date.now().toString();
    setWatchlists((prev) => [...prev, { id: newId, name, stocks: [] }]);
    return newId;
  };

  const addStockToWatchlist = (watchlistId: string, stock: TopGainers | TopLosers) => {
    setWatchlists((prev) =>
      prev.map((wl) =>
        wl.id === watchlistId
          ? { ...wl, stocks: [...wl.stocks, stock] }
          : wl
      )
    );
  };

  const removeStockFromWatchlist = (watchlistId: string, symbol: string) => {
    setWatchlists((prev) =>
      prev.map((wl) =>
        wl.id === watchlistId
          ? { ...wl, stocks: wl.stocks.filter((s) => s.ticker !== symbol) }
          : wl
      )
    );
  };

  const removeWatchlist = (watchlistId: string) => {
    setWatchlists((prev) => prev.filter((wl) => wl.id !== watchlistId));
  };

  return (
    <WatchlistContext.Provider value={{ watchlists, addWatchlist, addStockToWatchlist, removeStockFromWatchlist, removeWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within WatchlistProvider');
  return context;
}; 