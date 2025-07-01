import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
import { useNavigation } from '@react-navigation/native';
import { Watchlist } from '../../types'; // Adjust path as needed
import CreateWatchlist, { CreateWatchlistBottomSheetRef } from '../../components/watchlist/CreateWatchlist';

const WatchlistHomeScreen = () => {
  const { watchlists, addWatchlist } = useWatchlist();
  const navigation = useNavigation<any>();
  const createWatchlistRef = useRef<CreateWatchlistBottomSheetRef>(null);

  const showCreateForm = () => {
    createWatchlistRef.current?.show();
  };

  const handleCreateWatchlist = (name: string) => {
    addWatchlist(name);
  };

  const handleWatchlistPress = (watchlist: Watchlist) => {
    navigation.navigate('WatchlistDetail', { 
      title: watchlist.name,
      id : watchlist.id,
     });
  };

  const renderWatchlist = ({ item }: { item: Watchlist }) => (
    <TouchableOpacity
      style={styles.watchlistRow}
      onPress={() => handleWatchlistPress(item)}
    >
      <View style={styles.watchlistInfo}>
        <Text style={styles.watchlistName}>{item.name}</Text>
        <Text style={styles.stockCount}>{item.stocks.length} stocks</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  if (watchlists.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Watchlists</Text>
            <TouchableOpacity style={styles.addButton} onPress={showCreateForm}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No watchlists yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first watchlist to get started
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={showCreateForm}
            >
              <Text style={styles.primaryButtonText}>Create Watchlist</Text>
            </TouchableOpacity>
          </View>

          <CreateWatchlist
            ref={createWatchlistRef}
            onCreateWatchlist={handleCreateWatchlist}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Watchlists</Text>
          <TouchableOpacity style={styles.addButton} onPress={showCreateForm}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={watchlists}
          renderItem={renderWatchlist}
          keyExtractor={(item: Watchlist) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <CreateWatchlist
          ref={createWatchlistRef}
          onCreateWatchlist={handleCreateWatchlist}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  addButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  watchlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#F3F4F6',
  },
  watchlistInfo: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  stockCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  arrow: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1F2937',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WatchlistHomeScreen;