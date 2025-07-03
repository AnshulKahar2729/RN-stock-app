import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { Theme } from '../../utils';

interface ProductHeaderProps {
  ticker: string;
  companyName?: string;
  onBookmarkPress: () => void;
}

const ProductHeader = memo<ProductHeaderProps>(({
  ticker,
  companyName,
  onBookmarkPress,
}) => {
  const { theme } = useTheme();
  const { watchlists } = useWatchlist();
  const styles = getStyles(theme);

  // Check if the stock is already in any watchlist
  const isInWatchlist = useMemo(() => 
    watchlists.some(watchlist =>
      watchlist.tickers?.some(stock => stock === ticker)
    ), [watchlists, ticker]
  );

  const handleBookmarkPress = useCallback(() => {
    onBookmarkPress();
  }, [onBookmarkPress]);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.ticker}>{ticker.toUpperCase()}</Text>
        {companyName && (
          <Text style={styles.companyName} numberOfLines={2}>
            {companyName}
          </Text>
        )}
      </View>

      {/* Bookmark icon */}
      <TouchableOpacity
        style={styles.bookmarkIcon}
        onPress={handleBookmarkPress}
        activeOpacity={0.7}
      >
        <Icon
          name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
          size={24}
          color={isInWatchlist ? theme.primary || '#007AFF' : theme.text}
        />
      </TouchableOpacity>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      backgroundColor: theme.background,
    },
    headerContent: {
      flex: 1,
    },
    ticker: {
      fontSize: theme.font.size.xxl,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginBottom: 4,
    },
    companyName: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: '400' as any,
      lineHeight: 18,
    },
    bookmarkIcon: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.card,
      marginLeft: 12,
    },
  });

ProductHeader.displayName = 'ProductHeader';

export default ProductHeader; 