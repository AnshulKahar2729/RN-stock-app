import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatValue, Theme } from '../../utils';
import { StockOverview } from '../../types/stock';

interface QuickStatsProps {
  overview: StockOverview;
}

const QuickStats = memo<QuickStatsProps>(({ overview }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.quickStatsContainer}>
      <View style={styles.quickStat}>
        <Text style={styles.quickStatLabel}>Market Cap</Text>
        <Text style={styles.quickStatValue}>
          {formatCurrency(overview.MarketCapitalization)}
        </Text>
      </View>
      <View style={styles.quickStat}>
        <Text style={styles.quickStatLabel}>P/E Ratio</Text>
        <Text style={styles.quickStatValue}>
          {formatValue(overview.PERatio)}
        </Text>
      </View>
      <View style={styles.quickStat}>
        <Text style={styles.quickStatLabel}>52W High</Text>
        <Text style={styles.quickStatValue}>
          {formatCurrency(overview['52WeekHigh'])}
        </Text>
      </View>
      <View style={styles.quickStat}>
        <Text style={styles.quickStatLabel}>52W Low</Text>
        <Text style={styles.quickStatValue}>
          {formatCurrency(overview['52WeekLow'])}
        </Text>
      </View>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    quickStatsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
    },
    quickStat: {
      flex: 1,
      alignItems: 'center',
    },
    quickStatLabel: {
      fontSize: theme.font.size.xs,
      color: theme.subtext,
      marginBottom: 4,
      textAlign: 'center',
    },
    quickStatValue: {
      fontSize: theme.font.size.sm,
      fontWeight: 'bold' as any,
      color: theme.text,
      textAlign: 'center',
    },
  });

QuickStats.displayName = 'QuickStats';

export default QuickStats; 