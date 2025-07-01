import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { fetchTopGainers, fetchTopLosers } from '../../services/api';
import TopStockCard from '../../components/TopStockCard';
import { TopStock } from '../../types/stock';
import { EmptyStockGrid } from '../../components/EmptyStockGrid';
import { HomeHeader } from '../../components/HomeHeader';
import { useTheme } from '../../context/ThemeContext';

const HomeScreen = ({ navigation }: any) => {
  const [gainers, setGainers] = useState<TopStock[]>([]);
  const [losers, setLosers] = useState<TopStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, mode } = useTheme();

  const loadStockData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      const [gainersData, losersData] = await Promise.all([
        fetchTopGainers(),
        fetchTopLosers(),
      ]);

      setGainers(gainersData || []);
      setLosers(losersData || []);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      setError('Failed to load stock data. Please try again.');
    } finally {
      setLoading(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStockData(true);
  }, [loadStockData]);

  useEffect(() => {
    loadStockData();
  }, [loadStockData]);

  // Memoize sliced data to prevent unnecessary re-renders
  const displayedGainers = useMemo(() => gainers.slice(0, 4), [gainers]);
  const displayedLosers = useMemo(() => losers.slice(0, 4), [losers]);

  // Memoized navigation handlers
  const navigateToViewAll = useCallback(
    (type: 'gainers' | 'losers') => {
      navigation?.navigate?.('ViewAll', { type });
    },
    [navigation],
  );

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 120,
      offset: 120 * index,
      index,
    }),
    [],
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }] }>
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.subtext }]}>Loading stocks...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }] }>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader />

        {/* Top Gainers Section */}
        <View style={[styles.section, { backgroundColor: theme.card }] }>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Gainers</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToViewAll('gainers')}
              style={[styles.viewAllButton, { backgroundColor: theme.primary + '15' }]}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {displayedGainers.length > 0 ? (
            <FlatList
              data={displayedGainers}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <TopStockCard stock={item} />
                </View>
              )}
              keyExtractor={item => `gainer-${item.ticker}`}
              scrollEnabled={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              initialNumToRender={4}
              getItemLayout={getItemLayout}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <EmptyStockGrid
              message={
                error ? 'Failed to load data' : 'No gainers data available'
              }
              error={error}
              loadStockData={loadStockData}
            />
          )}
        </View>

        {/* Top Losers Section */}
        <View style={[styles.section, { backgroundColor: theme.card }] }>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Losers</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToViewAll('losers')}
              style={[styles.viewAllButton, { backgroundColor: theme.primary + '15' }]}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {displayedLosers.length > 0 ? (
            <FlatList
              data={displayedLosers}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <TopStockCard stock={item} />
                </View>
              )}
              keyExtractor={item => `loser-${item.ticker}`}
              scrollEnabled={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              initialNumToRender={4}
              getItemLayout={getItemLayout}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <EmptyStockGrid
              message={
                error ? 'Failed to load data' : 'No losers data available'
              }
              error={error}
              loadStockData={loadStockData}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#007AFF15',
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  // Empty state styles
  emptyGridContainer: {
    height: 264, // Same height as 2 rows of cards (120 + 12 gap + 120 + 12)
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: '80%',
    maxWidth: 280,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 24,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 12,
  },
  retryButtonSmall: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonTextSmall: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
