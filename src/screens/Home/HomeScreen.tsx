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
import StockCard from '../../components/StockCard';
import { TopGainers, TopLosers } from '../../types';
import { EmptyStockGrid } from '../../components/EmptyStockGrid';
import { HomeHeader } from '../../components/HomeHeader';

const HomeScreen = ({ navigation }: any) => {
  const [gainers, setGainers] = useState<TopGainers[]>([]);
  const [losers, setLosers] = useState<TopLosers[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const navigateToGainersViewAll = useCallback(() => {
    navigation?.navigate?.('ViewAll', { type: 'gainers' });
  }, [navigation]);

  const navigateToLosersViewAll = useCallback(() => {
    navigation?.navigate?.('ViewAll', { type: 'losers' });
  }, [navigation]);

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
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading stocks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader />

        {/* Top Gainers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Top Gainers</Text>
            </View>
            <TouchableOpacity
              onPress={navigateToGainersViewAll}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {displayedGainers.length > 0 ? (
            <FlatList
              data={displayedGainers}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <StockCard stock={item} />
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Top Losers</Text>
            </View>
            <TouchableOpacity
              onPress={navigateToLosersViewAll}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {displayedLosers.length > 0 ? (
            <FlatList
              data={displayedLosers}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <StockCard stock={item} />
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
    backgroundColor: '#f8f9fa',
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  searchContainer: {
    marginLeft: 16,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: 140,
  },
  errorContainer: {
    backgroundColor: '#fee',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  summaryCardTitle: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
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
