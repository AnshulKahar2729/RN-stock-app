import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TopGainers, TopLosers } from '../types';

interface StockCardProps {
  stock: TopGainers | TopLosers;
  onPress?: () => void;
}

const StockCard: React.FC<StockCardProps> = memo(({ stock, onPress }) => {
  const isPositive = stock.change_percentage >= '0';
  
  return (
    <TouchableOpacity 
      style={{ 
        flex: 1, 
        margin: 8, 
        padding: 16, 
        borderWidth: 1, 
        borderRadius: 8,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 120 // Consistent height
      }} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Stock Icon/Avatar */}
      <View style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: '#f5f5f5',
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ 
          fontSize: 16, 
          fontWeight: 'bold', 
          color: '#666' 
        }}>
          {stock.ticker?.charAt(0) || '?'}
        </Text>
      </View>
      
      {/* Stock Name */}
      <Text style={{ 
        fontSize: 14, 
        fontWeight: '600',
        marginBottom: 4,
        // numberOfLines: 1
      }} numberOfLines={1}>
        {stock.ticker || stock.ticker}
      </Text>
      
      {/* Stock Price */}
      <Text style={{ 
        fontSize: 16, 
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333'
      }}>
        ${typeof stock.price === 'string' ? stock.price : stock.price}
      </Text>
      
      {/* Change Percentage */}
      <Text style={{ 
        fontSize: 12, 
        fontWeight: '500',
        color: isPositive ? '#4caf50' : '#f44336'
      }}>
        {isPositive ? '+' : ''}{typeof stock.change_percentage === 'string' ? stock.change_percentage : stock.change_percentage}%
      </Text>
    </TouchableOpacity>
  );
});

StockCard.displayName = 'StockCard';

export default StockCard;