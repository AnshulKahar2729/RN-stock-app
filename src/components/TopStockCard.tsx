import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TopStock } from '../types/stock';
import { useNavigation } from '@react-navigation/native';

interface TopStockCardProps {
  stock: TopStock;
}

const TopStockCard: React.FC<TopStockCardProps> = memo(({ stock }) => {
  const isPositive = stock.change_percentage >= '0';
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('Product', { ticker: stock.ticker });
  };

  // Use only green/red based on performance
  const primaryColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <TouchableOpacity
      style={[
        styles.stockCard,
        { 
          backgroundColor: isPositive ? '#f8fffa' : '#fff8f8',
          borderLeftWidth: 3,
          borderLeftColor: isPositive ? '#10b981' : '#ef4444',
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      
      {/* Header row with icon and change indicator */}
      <View style={styles.headerRow}>
        {/* Enhanced Stock Icon */}
        <View style={[
          styles.stockIcon,
          { 
            backgroundColor: primaryColor + '15',
            borderWidth: 2,
            borderColor: primaryColor + '30',
          }
        ]}>
          <Text style={[styles.stockIconText, { color: primaryColor }]}>
            {stock.ticker?.charAt(0) || '?'}
          </Text>
        </View>

       
      </View>

      {/* Stock Ticker with playful styling */}
      <Text style={[styles.stockTicker, { color: primaryColor }]} numberOfLines={1}>
        {stock.ticker || 'N/A'}
      </Text>

      {/* Stock Price with emphasis */}
      <View style={styles.priceRow}>
        <Text style={styles.dollarSign}>$</Text>
        <Text style={styles.stockPrice}>
          {typeof stock.price === 'string' ? stock.price : stock.price || '0.00'}
        </Text>
      </View>

      {/* Enhanced Change Percentage */}
      <View style={styles.changeRow}>
        <Text style={[
          styles.stockChangePercentage,
          { color: isPositive ? '#059669' : '#dc2626' }
        ]}>
          {isPositive ? '+' : ''}
          {typeof stock.change_percentage === 'string'
            ? stock.change_percentage
            : stock.change_percentage || '0.00'}%
        </Text>
      </View>
    </TouchableOpacity>
  );
});

TopStockCard.displayName = 'TopStockCard';

const styles = StyleSheet.create({
  stockCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 140,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stockIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  stockIconText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sparkle: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.8,
  },


  stockTicker: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  dollarSign: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginRight: 2,
  },
  stockPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockChangePercentage: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

});

export default TopStockCard;