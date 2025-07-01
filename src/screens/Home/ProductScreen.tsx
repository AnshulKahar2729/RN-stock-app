import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useStockOverview } from '../../hooks/useStock';

const ProductScreen = () => {
  const route = useRoute<RouteProp<{ params: { ticker: string } }, 'params'>>();
  const { ticker } = route.params;
  const { overview, isLoading } = useStockOverview(ticker);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.stockName}>{ticker}</Text>
          <Text>Symbol: {overview?.Symbol}</Text>
          <Text>Name: {overview?.Name}</Text>
          <Text>Description: {overview?.Description}</Text>
          <Text>Sector: {overview?.Sector}</Text>
          <Text>Industry: {overview?.Industry}</Text>
          <Text>Country: {overview?.Country}</Text>
          <Text>Exchange: {overview?.Exchange}</Text>
          <Text>Currency: {overview?.Currency}</Text>
          <Text style={styles.stockName}>{ticker}</Text>
          <Text>Symbol: {overview?.Symbol}</Text>
          <Text>Name: {overview?.Name}</Text>
          <Text>Description: {overview?.Description}</Text>
          <Text>Sector: {overview?.Sector}</Text>
          <Text>Industry: {overview?.Industry}</Text>
          <Text>Country: {overview?.Country}</Text>
          <Text>Exchange: {overview?.Exchange}</Text>
          <Text>Currency: {overview?.Currency}</Text>
          <Text>MarketCapitalization: {overview?.MarketCapitalization}</Text>
          <Text>EBITDA: {overview?.EBITDA}</Text>
          <Text>PERatio: {overview?.PERatio}</Text>
          <Text>PEGRatio: {overview?.PEGRatio}</Text>
          <Text>BookValue: {overview?.BookValue}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  stockName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProductScreen;
