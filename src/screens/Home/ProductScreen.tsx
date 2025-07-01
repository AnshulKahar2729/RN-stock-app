import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { TopGainers, TopLosers } from '../../types';
import { useWatchlist } from '../../context/WatchlistContext';
// import { LineChart } from 'react-native-svg-charts'; // Uncomment if using a chart library

const ProductScreen = () => {
  const route =
    useRoute<
      RouteProp<{ params: { stock: TopGainers | TopLosers } }, 'params'>
    >();
  const navigation = useNavigation<any>();
  const { stock } = route.params;
  const { watchlists } = useWatchlist();

  const [inWatchlist, setInWatchlist] = useState(false);

  // Check if stock is in any watchlist
  useEffect(() => {
    const isInAnyWatchlist = watchlists.some(wl => 
      wl.stocks.some(s => s.ticker === stock.ticker)
    );
    setInWatchlist(isInAnyWatchlist);
  }, [watchlists, stock.ticker]);

  const onPress = () => {
    if (inWatchlist) {
      // For now, just show a message that they need to remove from watchlist screen
      // In a more complete implementation, you might want to show a modal to select which watchlist to remove from
      Alert.alert('Stock in Watchlist', 'Please remove this stock from the Watchlist screen');
    } else {
      // Navigate to the modal to add to watchlist
      navigation.navigate('AddToWatchlistModal', { stock });
    }
  };

  // Placeholder for chart data
  // const chartData = [stock.price, stock.price + 2, stock.price - 1, stock.price + 3];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{stock.ticker}</Text>
      {/* <Text>Symbol: {stock.ticker}</Text> */}
      <Text>Price: {stock.price}</Text>
      <Text>
        Change: {stock.change_amount} ({stock.change_percentage}%)
      </Text>
      {/* <LineChart style={{ height: 200 }} data={chartData} svg={{ stroke: 'rgb(134, 65, 244)' }} contentInset={{ top: 20, bottom: 20 }} /> */}
      <View style={{ marginVertical: 16 }}>
        <Button
          title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          onPress={onPress}
        />
      </View>
    </View>
  );
};

export default ProductScreen;
