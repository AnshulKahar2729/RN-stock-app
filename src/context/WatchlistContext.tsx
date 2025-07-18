import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TopStock, Watchlist } from '../types/stock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const WATCHLISTS_STORAGE_KEY = 'WATCHLISTS_STORAGE_KEY';

interface WatchlistContextProps {
  watchlists: Watchlist[];
  addWatchlist: (name: string) => string;
  addStockToWatchlist: (watchlistId: string, stock: TopStock) => void;
  removeStockFromWatchlist: (watchlistId: string, symbol: string) => void;
  removeWatchlist: (watchlistId: string) => void;
}

const WatchlistContext = createContext<WatchlistContextProps | undefined>(
  undefined,
);

export const WatchlistProvider = React.memo<{ children: React.ReactNode }>(({
  children,
}) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlists from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadWatchlists = async () => {
      try {
        const data = await AsyncStorage.getItem(WATCHLISTS_STORAGE_KEY);
        console.log('data', data);
        if (isMounted && data) {
          setWatchlists(JSON.parse(data));
        }
      } catch (e) {
        console.error('Failed to load watchlists', e);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };
    
    loadWatchlists();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save watchlists to AsyncStorage whenever they change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    
    const saveWatchlists = async () => {
      try {
        await AsyncStorage.setItem(
          WATCHLISTS_STORAGE_KEY,
          JSON.stringify(watchlists),
        );
      } catch (e) {
        console.error('Failed to save watchlists', e);
      }
    };

    saveWatchlists();
  }, [watchlists, isLoaded]);

  const addWatchlist = useCallback((name: string): string => {
    const newId = Date.now().toString();
    // name and id should be unique
    const isNameUnique = watchlists.every(wl => wl.name !== name);
    if (!isNameUnique) {
      Alert.alert('Error', 'Watchlist name must be unique');
      return '';
    } else {
      setWatchlists(prev => [...prev, { id: newId, name, tickers: [] }]);
      return newId;
    }
  }, [watchlists]);

  const addStockToWatchlist = useCallback((watchlistId: string, stock: TopStock) => {
    console.log('addStockToWatchlist', watchlistId, stock);
    console.log('watchlists', watchlists);
    setWatchlists(prev =>
      prev.map(wl =>
        wl.id === watchlistId
          ? {
              ...wl,
              tickers: wl?.tickers?.includes(stock.ticker)
                ? wl?.tickers
                : [...(wl?.tickers || []), stock.ticker],
            }
          : wl,
      ),
    );
  }, [watchlists]);

  const removeStockFromWatchlist = useCallback((watchlistId: string, symbol: string) => {
    setWatchlists(prev =>
      prev.map(wl =>
        wl.id === watchlistId
          ? {
              ...wl,
              tickers: wl?.tickers?.filter((t: string) => t !== symbol) || [],
            }
          : wl,
      ),
    );
  }, []);

  const removeWatchlist = useCallback((watchlistId: string) => {
    setWatchlists(prev => prev.filter(wl => wl.id !== watchlistId));
  }, []);

  const contextValue = useMemo(() => ({
    watchlists,
    addWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist,
    removeWatchlist,
  }), [watchlists, addWatchlist, addStockToWatchlist, removeStockFromWatchlist, removeWatchlist]);

  return (
    <WatchlistContext.Provider value={contextValue}>
      {children}
    </WatchlistContext.Provider>
  );
});

WatchlistProvider.displayName = 'WatchlistProvider';

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context)
    throw new Error('useWatchlist must be used within WatchlistProvider');
  return context;
};
