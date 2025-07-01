import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { TopGainers, TopLosers } from '../../types';

const AddToWatchlistModal: React.FC = () => {
  const route = useRoute<RouteProp<{ params: { stock: TopGainers | TopLosers } }, 'params'>>();
  const navigation = useNavigation<any>();
  const { stock } = route.params;
  const { watchlists, addWatchlist, addStockToWatchlist } = useWatchlist();
  const [newListName, setNewListName] = useState('');

  const handleCreateAndAdd = () => {
    if (newListName.trim()) {
      const newWatchlistId = addWatchlist(newListName);
      // Add the stock to the newly created watchlist
      addStockToWatchlist(newWatchlistId, stock);
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#00000099', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 8, width: '80%' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Add to Watchlist</Text>
        <Text style={{ marginTop: 12 }}>Select Watchlist:</Text>
        <FlatList
          data={watchlists}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => {
                addStockToWatchlist(item.id, stock);
                navigation.goBack();
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No watchlists yet.</Text>}
        />
        <Text style={{ marginTop: 12 }}>Or create new:</Text>
        <TextInput
          placeholder="New Watchlist Name"
          value={newListName}
          onChangeText={setNewListName}
          style={{ borderWidth: 1, borderRadius: 6, padding: 8, marginVertical: 8 }}
        />
        <Button
          title="Create and Add"
          onPress={handleCreateAndAdd}
        />
        <Button title="Cancel" onPress={() => navigation.goBack()} color="red" />
      </View>
    </View>
  );
};

export default AddToWatchlistModal; 