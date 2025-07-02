// components/TimeSeriesChart.tsx - Fixed Version
import React, { useMemo, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../utils';

type TimeSeries = Record<
  string,
  {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  }
>;

interface TimeSeriesChartProps {
  data: TimeSeries;
  ticker: string;
  height?: number;
}

type TimePeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

const TIME_PERIODS: { label: TimePeriod; days: number }[] = [
  { label: '1D', days: 1 },
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: '5Y', days: 1825 },
];

// Safe number parsing utility
const safeParseFloat = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const str = String(value).trim();
  
  // Handle common invalid values
  if (str === 'N/A' || str === 'NaN' || str === 'None' || str === '--' || str === 'null') {
    return 0;
  }
  
  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

// Safe currency formatting
const safeCurrencyFormat = (value: number | string | null | undefined): string => {
  const numValue = safeParseFloat(value);
  
  if (numValue === 0) {
    return 'N/A';
  }
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  } catch (error) {
    return '$0.00';
  }
};

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: theme.shadow?.color || '#000',
    shadowOffset: theme.shadow?.offset || { width: 0, height: 2 },
    shadowOpacity: theme.shadow?.opacity || 0.1,
    shadowRadius: theme.shadow?.radius || 4,
    elevation: theme.shadow?.elevation || 3,
  },
  emptyContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: theme.shadow?.color || '#000',
    shadowOffset: theme.shadow?.offset || { width: 0, height: 2 },
    shadowOpacity: theme.shadow?.opacity || 0.1,
    shadowRadius: theme.shadow?.radius || 4,
    elevation: theme.shadow?.elevation || 3,
  },
  emptyText: {
    color: theme.subtext,
    fontSize: theme.font.size.md,
    fontWeight: '500',
    textAlign: 'center',
  },
  header: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: theme.font.size.lg,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: theme.font.size.sm,
    color: theme.subtext,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  periodButtonActive: {
    backgroundColor: theme.primary || '#007AFF',
  },
  periodButtonInactive: {
    backgroundColor: 'transparent',
  },
  periodButtonText: {
    fontSize: theme.font.size.xs,
    fontWeight: '500',
    color: theme.subtext,
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  lineChart: {
    borderRadius: 8,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  currentPrice: {
    fontSize: theme.font.size.lg,
    fontWeight: 'bold',
    color: theme.text,
  },
  priceChangeText: {
    fontSize: theme.font.size.sm,
    fontWeight: '600',
  },
  priceChangePositive: {
    color: '#10B981',
  },
  priceChangeNegative: {
    color: '#EF4444',
  },
});

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  ticker,
  height = 220
}) => {
  const screenWidth = Dimensions.get('window').width;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return { 
        labels: [''], 
        datasets: [{ data: [0] }],
        prices: [0],
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        hasValidData: false
      };
    }

    const selectedDays = TIME_PERIODS.find(p => p.label === selectedPeriod)?.days || 30;
    
    try {
      // Get and sort all entries, filtering out invalid data
      const allEntries = Object.entries(data)
        .map(([date, values]) => {
          const closePrice = safeParseFloat(values['4. close']);
          const timestamp = new Date(date).getTime();
          
          // Only include entries with valid data
          if (closePrice > 0 && !isNaN(timestamp)) {
            return {
              date,
              close: closePrice,
              timestamp
            };
          }
          return null;
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
        .sort((a, b) => a.timestamp - b.timestamp);

      if (allEntries.length === 0) {
        return { 
          labels: ['No Data'], 
          datasets: [{ data: [0] }],
          prices: [0],
          currentPrice: 0,
          priceChange: 0,
          priceChangePercent: 0,
          hasValidData: false
        };
      }

      // Take the last N days based on selected period
      const entries = allEntries.slice(-Math.min(selectedDays, allEntries.length));
      
      // Format dates for labels
      const formatDate = (timestamp: number) => {
        try {
          const date = new Date(timestamp);
          if (selectedPeriod === '1D') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } else if (['1W', '1M'].includes(selectedPeriod)) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          } else {
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          }
        } catch (error) {
          return '';
        }
      };

      // Create simplified labels
      const labels: string[] = [];
      const prices = entries.map(entry => entry.close);
      
      if (entries.length <= 3) {
        labels.push(...entries.map(entry => formatDate(entry.timestamp)));
      } else {
        for (let i = 0; i < entries.length; i++) {
          if (i === 0 || i === Math.floor(entries.length / 2) || i === entries.length - 1) {
            labels.push(formatDate(entries[i].timestamp));
          } else {
            labels.push('');
          }
        }
      }

      const currentPrice = prices[prices.length - 1] || 0;
      const previousPrice = prices[0] || currentPrice;
      const priceChange = currentPrice - previousPrice;
      const priceChangePercent = previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

      return {
        labels: labels.length > 0 ? labels : [''],
        datasets: [{
          data: prices.length > 0 ? prices : [0],
          color: (opacity = 1) => priceChange >= 0 
            ? `rgba(16, 185, 129, ${opacity})` 
            : `rgba(239, 68, 68, ${opacity})`,
          strokeWidth: 2.5
        }],
        prices,
        currentPrice,
        priceChange,
        priceChangePercent,
        hasValidData: prices.length > 0 && prices.some(p => p > 0)
      };
    } catch (error) {
      console.error('Error processing chart data:', error);
      return { 
        labels: ['Error'], 
        datasets: [{ data: [0] }],
        prices: [0],
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        hasValidData: false
      };
    }
  }, [data, selectedPeriod]);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 2,
    color: (opacity = 1) => chartData.priceChange >= 0 
      ? `rgba(16, 185, 129, ${opacity})` 
      : `rgba(239, 68, 68, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 8
    },
    propsForDots: {
      r: '0',
      strokeWidth: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.border || 'rgba(107, 114, 128, 0.2)',
      strokeWidth: 1,
      strokeOpacity: 0.3,
    },
    formatYLabel: (value: string) => {
      const num = safeParseFloat(value);
      if (num === 0) return '';
      if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
      return `$${num.toFixed(2)}`;
    },
  };

  const formatChange = (change: number, percent: number) => {
    if (!isFinite(change) || !isFinite(percent)) {
      return 'N/A';
    }
    
    const sign = change >= 0 ? '+' : '';
    const formattedChange = safeCurrencyFormat(Math.abs(change));
    return `${sign}${formattedChange} (${sign}${percent.toFixed(2)}%)`;
  };

  if (!chartData.hasValidData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No chart data available for {ticker}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.chartTitle}>
          {ticker.toUpperCase()} - Stock Price
        </Text>
        <Text style={styles.chartSubtitle}>
          Historical Price Movement
        </Text>
        
        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {TIME_PERIODS.map(({ label }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.periodButton,
                selectedPeriod === label 
                  ? styles.periodButtonActive 
                  : styles.periodButtonInactive
              ]}
              onPress={() => setSelectedPeriod(label)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === label && styles.periodButtonTextActive
              ]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <LineChart
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets
          }}
          width={screenWidth - 64}
          height={height}
          chartConfig={chartConfig}
          style={styles.lineChart}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          withShadow={false}
          fromZero={false}
          segments={4}
          yAxisInterval={1}
        />
      </View>
      
      {/* Price Information */}
      {chartData.currentPrice > 0 && (
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>
            {safeCurrencyFormat(chartData.currentPrice)}
          </Text>
          <Text style={[
            styles.priceChangeText,
            chartData.priceChange >= 0 
              ? styles.priceChangePositive 
              : styles.priceChangeNegative
          ]}>
            {formatChange(chartData.priceChange, chartData.priceChangePercent)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TimeSeriesChart;
export { TimeSeriesChart };