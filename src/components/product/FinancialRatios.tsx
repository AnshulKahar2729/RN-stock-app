import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatValue, formatPercentage, Theme } from '../../utils';
import { StockOverview } from '../../types/stock';
import SectionHeader from '../common/SectionHeader';
import DataRow from '../common/DataRow';

interface FinancialRatiosProps {
  overview: StockOverview;
}

const FinancialRatios = memo<FinancialRatiosProps>(({ overview }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <SectionHeader title="Financial Ratios" icon="analytics-outline" />
      <DataRow
        label="EPS"
        value={formatValue(overview?.EPS)}
        icon="stats-chart-outline"
      />
      <DataRow
        label="Book Value"
        value={formatValue(overview?.BookValue)}
        icon="library-outline"
      />
      <DataRow
        label="ROE (TTM)"
        value={formatPercentage(overview?.ReturnOnEquityTTM)}
        icon="arrow-up-circle-outline"
      />
      <DataRow
        label="ROA (TTM)"
        value={formatPercentage(overview?.ReturnOnAssetsTTM)}
        icon="pie-chart-outline"
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

FinancialRatios.displayName = 'FinancialRatios';

export default FinancialRatios; 