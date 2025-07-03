import React, { useCallback, memo } from 'react';
import {
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListRenderItemInfo,
} from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
import { Watchlist } from '../../types/stock';
import { WatchListListItem } from './WatchListListItem';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

// Memoized Empty State Component
const EmptyState = memo<{ 
  showCreateForm: () => void;
}>(({ showCreateForm }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: theme.accent + '10' },
        ]}
      >
        <Icon name="eye-outline" size={48} color={theme.accent} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No watchlists yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
        Create your first watchlist to track your favorite stocks and monitor
        their performance
      </Text>
      <TouchableOpacity
        style={[styles.primaryButton]}
        onPress={showCreateForm}
        activeOpacity={0.8}
      >
        <Icon name="add" size={18} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>Create Watchlist</Text>
      </TouchableOpacity>
    </View>
  );
});

// Memoized Watchlist Item Component
const WatchlistItem = memo<{
  item: Watchlist;
}>(({ item }) => (
  <WatchListListItem item={item} />
));

// Memoized Watchlist Content Component
const WatchlistContent = memo<{
  watchlists: Watchlist[];
}>(({ watchlists }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderWatchlist = useCallback(
    ({ item }: ListRenderItemInfo<Watchlist>) => (
      <WatchlistItem item={item} />
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Watchlist) => item.id,
    []
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 80, // Approximate item height
      offset: 80 * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.flatListView}>
      <Text style={styles.flatListTitle}>Manage your watchlists</Text>
      <FlatList
        data={watchlists}
        renderItem={renderWatchlist}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
        windowSize={10}
        getItemLayout={getItemLayout}
      />
    </View>
  );
});

export const WatchListList = memo<{
  showCreateForm: () => void;
}>(({ showCreateForm }) => {
  const { watchlists } = useWatchlist();

  if (watchlists.length === 0) {
    return <EmptyState showCreateForm={showCreateForm} />;
  }

  return <WatchlistContent watchlists={watchlists} />;
});

const getStyles = (theme: Theme) => StyleSheet.create({
  flatListView: {
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: theme.background,
    minHeight: Dimensions.get('window').height,
  },
  flatListTitle: {
    fontSize: theme.font.size.md,
    fontWeight: "400" as any,
    color: theme.subtext,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: theme.accent + '10',
  },
  emptyTitle: {
    fontSize: theme.font.size.xl,
    fontWeight: "bold" as any,
    marginBottom: 12,
    textAlign: 'center',
    color: theme.text,
  },
  emptySubtitle: {
    fontSize: theme.font.size.md,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
    color: theme.subtext,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: theme.shadow.color,
    shadowOffset: theme.shadow.offset,
    shadowOpacity: theme.shadow.opacity,
    shadowRadius: theme.shadow.radius,
    elevation: theme.shadow.elevation,
    backgroundColor: theme.primary,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: theme.card,
    fontSize: theme.font.size.md,
    fontWeight: "bold" as any,
  },
});

// Set display names for debugging
EmptyState.displayName = 'EmptyState';
WatchlistItem.displayName = 'WatchlistItem';
WatchlistContent.displayName = 'WatchlistContent';
WatchListList.displayName = 'WatchListList';
