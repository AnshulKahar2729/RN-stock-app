import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, safeParseFloat, Theme } from '../../utils';
import { StockOverview } from '../../types/stock';
import SectionHeader from '../common/SectionHeader';

interface PriceRangeProps {
  overview: StockOverview;
  currentPrice: string;
}

const PriceRange = memo<PriceRangeProps>(({ overview, currentPrice }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const getCurrentPricePosition = useCallback(() => {
    const current = safeParseFloat(currentPrice);
    const low = safeParseFloat(overview?.['52WeekLow']);
    const high = safeParseFloat(overview?.['52WeekHigh']);

    if (!current || !low || !high || high <= low) return 50;

    const position = ((current - low) / (high - low)) * 100;
    return Math.max(0, Math.min(100, position));
  }, [currentPrice, overview]);

  return (
    <View style={styles.section}>
      <SectionHeader title="Price Range" icon="trending-up-outline" />
      <View style={styles.priceRangeVisualContainer}>
        <View style={styles.priceLabelsRow}>
          <Text style={styles.priceLabelText}>
            {formatCurrency(overview?.['52WeekLow'])}
          </Text>
          <Text style={styles.priceLabelText}>
            {formatCurrency(overview?.['52WeekHigh'])}
          </Text>
        </View>

        <View style={styles.priceBarContainer}>
          <View style={styles.priceBar} />
          <View
            style={[
              styles.currentPriceIndicator,
              {
                left: `${getCurrentPricePosition()}%`,
              },
            ]}
          />
        </View>

        <View style={styles.currentPriceLabel}>
          <Text style={styles.currentPriceLabelText}>
            Current: {formatCurrency(currentPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 8,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 12,
    },
    priceRangeVisualContainer: {
      marginTop: 8,
    },
    priceLabelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    priceLabelText: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      fontWeight: '600' as any,
    },
    priceBarContainer: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      marginVertical: 8,
      position: 'relative',
    },
    priceBar: {
      height: '100%',
      backgroundColor: theme.primary || '#007AFF',
      borderRadius: 3,
    },
    currentPriceIndicator: {
      position: 'absolute',
      top: -4,
      width: 14,
      height: 14,
      backgroundColor: theme.primary || '#007AFF',
      borderRadius: 7,
      borderWidth: 2,
      borderColor: theme.background,
    },
    currentPriceLabel: {
      alignItems: 'center',
      marginTop: 12,
    },
    currentPriceLabelText: {
      fontSize: theme.font.size.sm,
      color: theme.text,
      fontWeight: 'bold' as any,
    },
  });

PriceRange.displayName = 'PriceRange';

export default PriceRange; 