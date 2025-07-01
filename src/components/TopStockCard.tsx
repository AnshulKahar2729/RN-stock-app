import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TopStock } from '../types/stock';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency, Theme } from '../utils';
import { useTheme } from '../context/ThemeContext';

interface TopStockCardProps {
  stock: TopStock;
}

const POSITIVE_COLOR = '#10b981';
const NEGATIVE_COLOR = '#ef4444';

const getStyles = (theme : Theme) => StyleSheet.create({
  stockCard: {
    flex: 1,
    margin: 4,
    padding: 10,
    borderRadius: 10,
    shadowColor: theme.shadow.color,
    shadowOffset: theme.shadow.offset,
    shadowOpacity: theme.shadow.opacity,
    shadowRadius: theme.shadow.radius,
    elevation: theme.shadow.elevation,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 90,
    backgroundColor: theme.card,
  },  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  stockIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: theme.border,
    backgroundColor: theme.background,
  },
  stockIconText: {
    fontSize: theme.font.size.lg,
    fontWeight: "bold" as any,
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
    fontSize: theme.font.size.md,
    fontWeight: "bold" as any,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  stockPrice: {
    fontSize: theme.font.size.xl,
    fontWeight: "bold" as any,
    color: theme.text,
    letterSpacing: -0.5,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockChangePercentage: {
    fontSize: theme.font.size.sm,
    fontWeight: "400" as any,
    letterSpacing: 0.3,
  },
});

const TopStockCard: React.FC<TopStockCardProps> = memo(({ stock }) => {
  const isPositive = stock.change_percentage >= '0';
  const navigation = useNavigation<any>();
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  const handlePress = () => {
    navigation.navigate('Product', { ticker: stock.ticker });
  };

  // Use only green/red based on performance
  const primaryColor = isPositive ? POSITIVE_COLOR : NEGATIVE_COLOR;
  const cardBg = mode === 'dark' ? theme.card : (isPositive ? '#f8fffa' : '#fff8f8');

  return (
    <TouchableOpacity
      style={[
        styles.stockCard,
        { 
          backgroundColor: cardBg,
          borderLeftWidth: 3,
          borderLeftColor: primaryColor,
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
        <Text style={[styles.stockPrice, { color: theme.text }] }>
          {typeof stock.price === 'string' ? formatCurrency(stock.price) : formatCurrency(stock.price) || '0.00'}
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

export default TopStockCard;