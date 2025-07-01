import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStockOverview, useTimeSeriesDaily } from '../../hooks/useStock';
import { formatCurrency, formatPercentage, formatValue } from '../../utils';
import { TimeSeriesDailyChart } from '../../components/TimeSeriesDailyChart';
import { useTheme } from '../../context/ThemeContext';

const ProductScreen = () => {
  const route = useRoute<RouteProp<{ params: { ticker: string } }, 'params'>>();
  const { ticker } = route.params;
  const { data: overview, isLoading, isError } = useStockOverview(ticker);
  const { data: timeSeriesDaily, isLoading: isTimeSeriesDailyLoading, isError: isTimeSeriesDailyError } = useTimeSeriesDaily(ticker);
  const { theme, mode } = useTheme();
  console.log('timeSeriesDaily', timeSeriesDaily);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }] }>
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.subtext }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }] }>
        <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.subtext }]}>Error loading stock data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }] }>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }] }>
          <Text style={[styles.ticker, { color: theme.text }]}>{ticker}</Text>

          {/* Book mark icon */}
          <TouchableOpacity style={styles.bookmarkIcon}>
            <Icon name="bookmark-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {isTimeSeriesDailyLoading && (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.subtext }]}>Loading...</Text>
          </View>
        )}
        
        {isTimeSeriesDailyError && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.subtext }]}>Error loading time series daily</Text>
          </View>
        )}
        
        {/* {timeSeriesDaily && ( */}
          <View style={styles.chartContainer}>
            <TimeSeriesDailyChart data={timeSeriesDaily || {}} ticker={ticker} />
          </View>
        {/* )} */}

        {/* Price Range */}
        <View style={styles.section}>
          <SectionHeader title="Price Range" icon="trending-up-outline" />
          <View style={styles.priceRangeContainer}>
            <DataRow
              label="52W Low"
              value={formatCurrency(overview?.['52WeekLow'] || '')}
            />
            <DataRow
              label="Current Price"
              value={formatCurrency(overview?.['50DayMovingAverage'] || '')}
            />
            <DataRow
              label="52W High"
              value={formatCurrency(overview?.['52WeekHigh'] || '')}
            />
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <SectionHeader title="Key Metrics" icon="bar-chart-outline" />
          <DataRow
            label="Market Cap"
            value={formatCurrency(overview?.MarketCapitalization || '')}
            icon="business-outline"
          />
          <DataRow
            label="P/E Ratio"
            value={formatValue(overview?.PERatio || '')}
            icon="calculator-outline"
          />
          <DataRow
            label="Beta"
            value={formatValue(overview?.Beta || '')}
            icon="pulse-outline"
          />
          <DataRow
            label="Dividend Yield"
            value={formatPercentage(overview?.DividendYield || '')}
            icon="cash-outline"
          />
          <DataRow
            label="Profit Margin"
            value={formatPercentage(overview?.ProfitMargin || '')}
            icon="trending-up-outline"
          />
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <SectionHeader
            title="Company Information"
            icon="information-circle-outline"
          />
          <DataRow
            label="Sector"
            value={formatValue(overview?.Sector || '')}
            icon="layers-outline"
          />
          <DataRow
            label="Industry"
            value={formatValue(overview?.Industry || '')}
            icon="construct-outline"
          />
          <DataRow
            label="Country"
            value={formatValue(overview?.Country || '')}
            icon="location-outline"
          />
          <DataRow
            label="Exchange"
            value={formatValue(overview?.Exchange || '')}
            icon="swap-horizontal-outline"
          />
          <DataRow
            label="Currency"
            value={formatValue(overview?.Currency || '')}
            icon="card-outline"
          />
        </View>

        {/* Financial Ratios */}
        <View style={styles.section}>
          <SectionHeader title="Financial Ratios" icon="analytics-outline" />
          <DataRow
            label="EPS"
            value={formatValue(overview?.EPS || '')}
            icon="stats-chart-outline"
          />
          <DataRow
            label="Book Value"
            value={formatValue(overview?.BookValue || '')}
            icon="library-outline"
          />
          <DataRow
            label="ROE (TTM)"
            value={formatPercentage(overview?.ReturnOnEquityTTM || '')}
            icon="arrow-up-circle-outline"
          />
          <DataRow
            label="ROA (TTM)"
            value={formatPercentage(overview?.ReturnOnAssetsTTM || '')}
            icon="pie-chart-outline"
          />
        </View>

        {/* Company Description */}
        {overview?.Description && (
          <View style={styles.section}>
            <SectionHeader title="About" icon="document-text-outline" />
            <Text style={styles.description}>{overview.Description}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const DataRow = memo(({ label, value, icon }: { label: string; value: string; icon?: string }) => (
  <View style={styles.dataRow}>
    <View style={styles.labelContainer}>
      {icon && (
        <Icon name={icon} size={16} color="#6B7280" style={styles.icon} />
      )}
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
));

const SectionHeader = memo(({ title, icon }: { title: string; icon: string }) => (
  <View style={styles.sectionHeader}>
    <Icon name={icon} size={20} color="#374151" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticker: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  priceRangeContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    marginTop: 8,
  },
  bookmarkIcon: {
    padding: 10,
  },
  chartContainer: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default ProductScreen;
