import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { fetchTopGainers, fetchTopLosers } from '../../services/api';
import StockCard from '../../components/StockCard';
import { TopGainers, TopLosers } from '../../types';

const HomeScreen = ({ navigation }: any) => {
  const [gainers, setGainers] = useState<TopGainers[]>([]);
  const [losers, setLosers] = useState<TopLosers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStockData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [gainersData, losersData] = await Promise.all([
        fetchTopGainers(),
        fetchTopLosers()
      ]);
      
      setGainers(gainersData || []);
      setLosers(losersData || []);
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      setError('Failed to load stock data');
      // Keep existing data on error, don't reset to empty arrays
    } finally {
      setLoading(false);
    }
  }, []);

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

  const navigateToProduct = useCallback((stock: TopGainers | TopLosers) => {
    navigation?.navigate?.('Product', { stock });
  }, [navigation]);

  // Memoized render functions
  const renderGainerItem = useCallback(({ item }: { item: TopGainers }) => (
    <StockCard 
      stock={item} 
      onPress={() => navigateToProduct(item)} 
    />
  ), [navigateToProduct]);

  const renderLoserItem = useCallback(({ item }: { item: TopLosers }) => (
    <StockCard 
      stock={item} 
      onPress={() => navigateToProduct(item)} 
    />
  ), [navigateToProduct]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 100, // Estimated item height
    offset: 100 * index,
    index,
  }), []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading stocks...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16 
      }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Stocks App</Text>
        <TextInput 
          placeholder="Search here..." 
          style={{ 
            borderWidth: 1, 
            borderRadius: 8, 
            padding: 8, 
            width: 150,
            borderColor: '#ddd'
          }} 
        />
      </View>

      {/* Error Message */}
      {error && (
        <View style={{ 
          backgroundColor: '#ffebee', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 16 
        }}>
          <Text style={{ color: '#c62828', textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity 
            onPress={loadStockData}
            style={{ 
              marginTop: 8, 
              alignSelf: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: '#c62828',
              borderRadius: 4
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Top Gainers Section */}
      <View style={{ flex: 1, marginBottom: 16 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Top Gainers</Text>
          <TouchableOpacity onPress={navigateToGainersViewAll}>
            <Text style={{ color: '#007AFF' }}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={displayedGainers}
          numColumns={2}
          renderItem={renderGainerItem}
          keyExtractor={(item) => `gainer-${item.ticker}`}
          scrollEnabled={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={4}
          initialNumToRender={4}
          getItemLayout={getItemLayout}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }} // Allow content to grow within available space
        />
      </View>

      {/* Top Losers Section */}
      <View style={{ flex: 1 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Top Losers</Text>
          <TouchableOpacity onPress={navigateToLosersViewAll}>
            <Text style={{ color: '#007AFF' }}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={displayedLosers}
          numColumns={2}
          renderItem={renderLoserItem}
          keyExtractor={(item) => `loser-${item.ticker}`}
          scrollEnabled={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={4}
          initialNumToRender={4}
          getItemLayout={getItemLayout}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }} // Allow content to grow within available space
        />
      </View>
    </View>
  );
};

export default HomeScreen;