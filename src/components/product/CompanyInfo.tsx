import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { formatValue, Theme } from '../../utils';
import { StockOverview } from '../../types/stock';
import SectionHeader from '../common/SectionHeader';
import DataRow from '../common/DataRow';

interface CompanyInfoProps {
  overview: StockOverview;
}

const CompanyInfo = memo<CompanyInfoProps>(({ overview }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Company Information"
        icon="information-circle-outline"
      />
      <DataRow
        label="Sector"
        value={formatValue(overview?.Sector)}
        icon="layers-outline"
      />
      <DataRow
        label="Industry"
        value={formatValue(overview?.Industry)}
        icon="construct-outline"
      />
      <DataRow
        label="Country"
        value={formatValue(overview?.Country)}
        icon="location-outline"
      />
      <DataRow
        label="Exchange"
        value={formatValue(overview?.Exchange)}
        icon="swap-horizontal-outline"
      />
      <DataRow
        label="Currency"
        value={formatValue(overview?.Currency)}
        icon="card-outline"
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

CompanyInfo.displayName = 'CompanyInfo';

export default CompanyInfo; 