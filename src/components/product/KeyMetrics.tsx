import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatValue, formatPercentage, Theme } from '../../utils';
import { StockOverview } from '../../types/stock';
import SectionHeader from '../common/SectionHeader';
import DataRow from '../common/DataRow';

interface KeyMetricsProps {
  overview: StockOverview;
}

const KeyMetrics = memo<KeyMetricsProps>(({ overview }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <SectionHeader title="Key Metrics" icon="bar-chart-outline" />
      <DataRow
        label="Market Cap"
        value={formatCurrency(overview?.MarketCapitalization)}
        icon="business-outline"
      />
      <DataRow
        label="P/E Ratio"
        value={formatValue(overview?.PERatio)}
        icon="calculator-outline"
      />
      <DataRow
        label="Beta"
        value={formatValue(overview?.Beta)}
        icon="pulse-outline"
      />
      <DataRow
        label="Dividend Yield"
        value={formatPercentage(overview?.DividendYield)}
        icon="cash-outline"
      />
      <DataRow
        label="Profit Margin"
        value={formatPercentage(overview?.ProfitMargin)}
        icon="trending-up-outline"
      />
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
  });

KeyMetrics.displayName = 'KeyMetrics';

export default KeyMetrics; 