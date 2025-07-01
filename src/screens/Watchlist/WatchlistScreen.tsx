import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
import StockCard from '../../components/StockCard';
import { useNavigation } from '@react-navigation/native';

const WatchlistScreen = () => {
  const { watchlists, addWatchlist, removeStockFromWatchlist, removeWatchlist } = useWatchlist();
  const navigation = useNavigation<any>();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      addWatchlist(newWatchlistName.trim());
      setNewWatchlistName('');
      setShowCreateForm(false);
    } else {
      Alert.alert('Error', 'Please enter a watchlist name');
    }
  };

  const handleRemoveStock = (watchlistId: string, ticker: string) => {
    Alert.alert(
      'Remove Stock',
      `Remove ${ticker} from this watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeStockFromWatchlist(watchlistId, ticker)
        }
      ]
    );
  };

  const handleDeleteWatchlist = (watchlistId: string, watchlistName: string) => {
    Alert.alert(
      'Delete Watchlist',
      `Are you sure you want to delete "${watchlistName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => removeWatchlist(watchlistId)
        }
      ]
    );
  };

  const renderWatchlist = ({ item }: { item: any }) => (
    <View style={styles.watchlistContainer}>
      <View style={styles.watchlistHeader}>
        <View style={styles.watchlistHeaderLeft}>
          <Text style={styles.watchlistName}>{item.name}</Text>
          <Text style={styles.stockCount}>{item.stocks.length} stocks</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteWatchlistButton}
          onPress={() => handleDeleteWatchlist(item.id, item.name)}
        >
          <Text style={styles.deleteWatchlistButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      
      {item.stocks.length > 0 ? (
        <FlatList
          data={item.stocks}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: stock }) => (
            <View style={styles.stockContainer}>
              <StockCard 
                stock={stock} 
                onPress={() => navigation.navigate('Product', { stock })}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveStock(item.id, stock.ticker)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(stock) => stock.ticker}
          contentContainerStyle={styles.stocksList}
        />
      ) : (
        <View style={styles.emptyWatchlist}>
          <Text style={styles.emptyText}>No stocks in this watchlist</Text>
          <Text style={styles.emptySubtext}>Add stocks from the Home screen</Text>
        </View>
      )}
    </View>
  );

  if (watchlists.length === 0 && !showCreateForm) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No watchlists yet</Text>
        <Text style={styles.emptySubtitle}>Create your first watchlist to get started!</Text>
        <Button 
          title="Create Watchlist" 
          onPress={() => setShowCreateForm(true)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.createFormTitle}>Create New Watchlist</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter watchlist name"
            value={newWatchlistName}
            onChangeText={setNewWatchlistName}
            autoFocus
          />
          <View style={styles.buttonRow}>
            <Button 
              title="Cancel" 
              onPress={() => {
                setShowCreateForm(false);
                setNewWatchlistName('');
              }}
              color="red"
            />
            <Button 
              title="Create" 
              onPress={handleCreateWatchlist}
            />
          </View>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Watchlists</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={watchlists}
        renderItem={renderWatchlist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.watchlistsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  createForm: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  createFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  watchlistsList: {
    padding: 16,
  },
  watchlistContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  watchlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  watchlistHeaderLeft: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockCount: {
    fontSize: 14,
    color: '#666',
  },
  deleteWatchlistButton: {
    padding: 8,
  },
  deleteWatchlistButtonText: {
    fontSize: 18,
  },
  stocksList: {
    paddingRight: 16,
  },
  stockContainer: {
    position: 'relative',
    marginRight: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyWatchlist: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default WatchlistScreen;
