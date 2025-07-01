import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useWatchlist } from '../context/WatchlistContext';
import { TopStock } from '../types/stock';

interface AddToWatchlistSheetProps {
  stock: TopStock;
  onClose: () => void;
}

const AddToWatchlistSheet = forwardRef<
  BottomSheetModal,
  AddToWatchlistSheetProps
>(({ stock, onClose }, ref) => {
  const { watchlists, addWatchlist, addStockToWatchlist } = useWatchlist();
  const [newListName, setNewListName] = useState('');

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const handleCreateAndAdd = useCallback(() => {
    if (newListName.trim()) {
      const newWatchlistId = addWatchlist(newListName.trim());
      addStockToWatchlist(newWatchlistId, stock);
      setNewListName('');
      onClose();
    } else {
      Alert.alert('Error', 'Please enter a watchlist name');
    }
  }, [newListName, addWatchlist, addStockToWatchlist, stock, onClose]);

  const handleAddToExisting = useCallback(
    (watchlistId: string) => {
      addStockToWatchlist(watchlistId, stock);
      onClose();
    },
    [addStockToWatchlist, stock, onClose],
  );

  const renderWatchlistItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.watchlistItem}
        onPress={() => handleAddToExisting(item.id)}
      >
        <View style={styles.watchlistItemContent}>
          <Text style={styles.watchlistName}>{item.name}</Text>
          <Text style={styles.stockCount}>{item.stocks.length} stocks</Text>
        </View>
        <Text style={styles.addIcon}>+</Text>
      </TouchableOpacity>
    ),
    [handleAddToExisting],
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>Add {stock.ticker} to Watchlist</Text>

        {/* Existing Watchlists */}
        <Text style={styles.sectionTitle}>Select Watchlist:</Text>
        <FlatList
          data={watchlists}
          renderItem={renderWatchlistItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No watchlists yet.</Text>
          }
          style={styles.watchlistsList}
        />

        {/* Create New Watchlist */}
        <Text style={styles.sectionTitle}>Or create new:</Text>
        <BottomSheetTextInput
          style={styles.input}
          placeholder="New Watchlist Name"
          value={newListName}
          onChangeText={setNewListName}
          autoFocus={watchlists.length === 0}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateAndAdd}
          >
            <Text style={styles.createButtonText}>Create & Add</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  watchlistsList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  watchlistItemContent: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  stockCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

AddToWatchlistSheet.displayName = 'AddToWatchlistSheet';

export default AddToWatchlistSheet;
