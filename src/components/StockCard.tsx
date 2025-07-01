import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TopGainers, TopLosers } from '../types';
import { useNavigation } from '@react-navigation/native';

interface StockCardProps {
  stock: TopGainers | TopLosers;
}

const StockCard: React.FC<StockCardProps> = memo(({ stock }) => {
  const isPositive = stock.change_percentage >= '0';
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('Product', { ticker: stock.ticker });
  };

  return (
    <TouchableOpacity
      style={styles.stockCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Stock Icon/Avatar */}
      <View style={styles.stockIcon}>
        <Text style={styles.stockIconText}>
          {stock.ticker?.charAt(0) || '?'}
        </Text>
      </View>

      {/* Stock Name */}
      <Text style={styles.stockName} numberOfLines={1}>
        {stock.ticker || stock.ticker}
      </Text>

      {/* Stock Price */}
      <Text style={styles.stockPrice}>
        ${typeof stock.price === 'string' ? stock.price : stock.price}
      </Text>

      {/* Change Percentage */}
      <Text style={styles.stockChangePercentage}>
        {isPositive ? '+' : ''}
        {typeof stock.change_percentage === 'string'
          ? stock.change_percentage
          : stock.change_percentage}
        %
      </Text>
    </TouchableOpacity>
  );
});

StockCard.displayName = 'StockCard';

const styles = StyleSheet.create({
  stockCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  stockIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockIconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  stockName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stockChangePercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StockCard;
