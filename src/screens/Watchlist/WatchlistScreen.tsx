import React, { memo, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Watchlist } from '../../types/stock';
import { useWatchlist } from '../../context/WatchlistContext';
import { useTheme } from '../../context/ThemeContext';

// Import the new components
import WatchlistScreenHeader from '../../components/watchlist/WatchlistScreenHeader';
import WatchlistStockList from '../../components/watchlist/WatchlistStockList';
import NotFoundWatchlist from '../../components/watchlist/NotFoundWatchlist';

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      minHeight: Dimensions.get('window').height,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    stockList: {
      flex: 1,
    },
  });

const WatchListScreen = memo(() => {
  const { watchlists } = useWatchlist();
  const route =
    useRoute<RouteProp<{ params: { title: string; id: string } }, 'params'>>();
  const { title, id } = route.params;
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const selectedWatchlist = watchlists.find(w => w.id === id);
    if (selectedWatchlist) {
      setWatchlist(selectedWatchlist);
    }
  }, [id, watchlists]);

  if (!watchlist) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <NotFoundWatchlist />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <WatchlistScreenHeader 
        title={title} 
        stockCount={watchlist.tickers?.length || 0} 
      />
      <View style={styles.content}>
        <View style={styles.stockList}>
          <WatchlistStockList tickers={watchlist.tickers || []} />
        </View>
      </View>
    </SafeAreaView>
  );
});

WatchListScreen.displayName = 'WatchListScreen';

export default WatchListScreen;