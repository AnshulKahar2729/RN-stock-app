import React, { memo, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';
import WatchlistStockCard from './WatchlistStockCard';
import EmptyWatchlist from './EmptyWatchlist';

interface WatchlistStockListProps {
  tickers: string[];
}

const WatchlistStockList = memo<WatchlistStockListProps>(({ tickers }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderItem = useCallback(({ item }: { item: string }) => (
    <View style={styles.stockCardWrapper}>
      <WatchlistStockCard ticker={item} />
    </View>
  ), [styles]);

  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <FlatList
      data={tickers}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      contentContainerStyle={styles.stockListContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={EmptyWatchlist}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
});

const getStyles = (_theme: Theme) =>
  StyleSheet.create({
    stockCardWrapper: {
      flex: 0.5,
      paddingHorizontal: 6,
      paddingVertical: 6,
    },
    stockListContent: {
      paddingBottom: 20,
    },
  });

WatchlistStockList.displayName = 'WatchlistStockList';

export default WatchlistStockList; 