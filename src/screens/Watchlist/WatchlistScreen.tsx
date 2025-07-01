import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Watchlist } from '../../types';
import { useWatchlist } from '../../context/WatchlistContext';
import StockCard from '../../components/TopStockCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function WatchlistScreen() {
  const { watchlists } = useWatchlist();
  const route =
    useRoute<RouteProp<{ params: { title: string; id: string } }, 'params'>>();
  const { title, id } = route.params;
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);

  useEffect(() => {
    const selectedWatchlist = watchlists.find(w => w.id === id);
    if (selectedWatchlist) {
      setWatchlist(selectedWatchlist);
    }
  }, [id, watchlists]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="trending-up" size={48} color="#94A3B8" />
      </View>
      <Text style={styles.emptyTitle}>No stocks yet</Text>
      <Text style={styles.emptySubtitle}>
        Add stocks to your watchlist to track their performance
      </Text>
      <TouchableOpacity style={styles.addFirstStockButton}>
        <Icon name="add" size={20} color="white" />
        <Text style={styles.addFirstStockText}>Add Your First Stock</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStockList = () => (
    <FlatList
      data={watchlist?.stocks}
      renderItem={({ item }) => <StockCard stock={item} />}
      keyExtractor={item => item.ticker}
      numColumns={2}
      columnWrapperStyle={styles.stockListColumn}
      contentContainerStyle={styles.stockListContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
    />
  );

  if (!watchlist) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.notFoundContainer}>
          <Icon name="error-outline" size={64} color="#EF4444" />
          <Text style={styles.notFoundTitle}>Watchlist Not Found</Text>
          <Text style={styles.notFoundSubtitle}>
            The watchlist you're looking for doesn't exist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <Header title={title} stockCount={watchlist.stocks?.length || 0} />
      
      <View style={styles.content}>
        {/* Stock List */}
        <View style={styles.stockList}>
          {renderStockList()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  stockCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addStockButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  addStockText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 6,
  },
  stockList: {
    flex: 1,
  },
  stockListContent: {
    paddingBottom: 20,
  },
  stockListColumn: {
    justifyContent: 'space-between',
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#F1F5F9',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addFirstStockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addFirstStockText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 24,
    marginBottom: 8,
  },
  notFoundSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
});

function Header({ title, stockCount }: { title: string; stockCount: number }) {
  const navigation = useNavigation<any>();
  
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ padding: 4 }} // Increase touch target
        >
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      
      <View style={styles.headerRight}>
        <Text style={styles.stockCount}>
          {stockCount} {stockCount === 1 ? 'stock' : 'stocks'}
        </Text>
      </View>
    </View>
  );
}