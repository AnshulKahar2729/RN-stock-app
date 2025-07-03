// components/TimeSeriesChart.tsx - Optimized Version
import React, { useMemo, useState, useCallback, memo } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { useTimeSeries } from '../hooks/useStock';
import { Theme } from '../utils';

interface TimeSeriesChartProps {
  ticker: string;
  height?: number;
  currentPrice?: string | number; // Accept current price from parent
}

type TimePeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y';

interface ProcessedDataEntry {
  date: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
  priceChange: number;
  priceChangePercent: number;
  entries: ProcessedDataEntry[];
}

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

// Data Processing Component
const useChartData = (timeSeriesData: any, selectedPeriod: TimePeriod): ChartData => {
  return useMemo(() => {
    if (!timeSeriesData?.timeSeries) {
      return {
        labels: [],
        datasets: [{ data: [] }],
        priceChange: 0,
        priceChangePercent: 0,
        entries: [],
      };
    }

    // Process raw data
    const entries = Object.entries(timeSeriesData.timeSeries)
      .map(([timestamp, values]: [string, any]) => ({
        date: timestamp,
        close: safeParseFloat(values['4. close']),
        open: safeParseFloat(values['1. open']),
        high: safeParseFloat(values['2. high']),
        low: safeParseFloat(values['3. low']),
        volume: safeParseFloat(values['5. volume']),
      }))
      .filter(entry => entry.close > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (entries.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
        priceChange: 0,
        priceChangePercent: 0,
        entries: [],
      };
    }

    // Smart sampling to maintain data integrity
    let sampledEntries = entries;
    const maxPoints = 50;
    
    if (entries.length > maxPoints) {
      const step = Math.floor(entries.length / maxPoints);
      sampledEntries = [];
      
      // Always include first and last entries
      sampledEntries.push(entries[0]);
      
      // Sample intermediate entries evenly
      for (let i = step; i < entries.length - step; i += step) {
        sampledEntries.push(entries[i]);
      }
      
      // Always include last entry
      if (entries.length > 1) {
        sampledEntries.push(entries[entries.length - 1]);
      }
    }

    // Format labels consistently
    const formatLabel = (timestamp: string, index: number, total: number) => {
      const date = new Date(timestamp);
      
      // For fewer points, show more detail
      if (total <= 7) {
        if (selectedPeriod === '1D') {
          return date.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            hour12: true
          });
        }
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      // For more points, show fewer labels to avoid crowding
      if (index === 0 || index === total - 1 || index % Math.ceil(total / 6) === 0) {
        if (selectedPeriod === '1D') {
          return date.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            hour12: true
          });
        } else if (selectedPeriod === '1W') {
          return date.toLocaleDateString('en-US', { 
            weekday: 'short'
          });
        } else {
          return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
        }
      }
      
      return ''; // Empty label for intermediate points
    };

    const data = sampledEntries.map(entry => entry.close);
    const labels = sampledEntries.map((entry, index) => 
      formatLabel(entry.date, index, sampledEntries.length)
    );

    // Calculate price changes
    const firstPrice = data[0] || 0;
    const lastPrice = data[data.length - 1] || 0;
    const priceChange = lastPrice - firstPrice;
    const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

    return {
      labels,
      datasets: [{ data }],
      priceChange,
      priceChangePercent,
      entries: sampledEntries,
    };
  }, [timeSeriesData, selectedPeriod]);
};

// Chart Configuration Hook
const useChartConfig = (theme: Theme) => {
  return useMemo(() => {
    // Simple color extraction from hex
    const getColorRGB = (hexColor: string) => {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `${r}, ${g}, ${b}`;
    };

    const primaryColor = theme.primary ? getColorRGB(theme.primary) : '0, 122, 255';

    return {
      backgroundColor: 'transparent',
      backgroundGradientFrom: theme.card || '#FFFFFF',
      backgroundGradientTo: theme.card || '#FFFFFF',
      color: (opacity = 1) => `rgba(${primaryColor}, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
      useShadowColorFromDataset: false,
      decimalPlaces: 2,
      propsForLabels: {
        fontSize: 10,
        fontWeight: '400',
      },
      fillShadowGradient: `rgba(${primaryColor}, 0.1)`,
      fillShadowGradientOpacity: 0.3,
    };
  }, [theme]);
};

// Loading Component
const ChartLoadingScreen = memo<{ height: number }>(({ height }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { height }]}>
      <ActivityIndicator size="large" color={theme.primary || '#007AFF'} />
      <Text style={[styles.loadingText, { color: theme.subtext }]}>
        Loading chart data...
      </Text>
    </View>
  );
});

// Error Component
const ChartErrorScreen = memo<{ height: number; ticker: string }>(({ height, ticker }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.errorContainer, { height }]}>
      <Text style={[styles.errorText, { color: theme.subtext }]}>
        No chart data available for {ticker}
      </Text>
    </View>
  );
});

// Period Selector Component
const PeriodSelector = memo<{
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}>(({ selectedPeriod, onPeriodChange }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.periodSelector, { backgroundColor: theme.background }]}>
      {TIME_PERIODS.map(({ label }) => {
        const isActive = selectedPeriod === label;
        return (
          <TouchableOpacity
            key={label}
            style={[
              styles.periodButton,
              isActive 
                ? { backgroundColor: theme.primary || '#007AFF' }
                : { backgroundColor: 'transparent' }
            ]}
            onPress={() => onPeriodChange(label)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodButtonText,
                {
                  color: isActive 
                    ? '#FFFFFF' 
                    : theme.subtext || '#666666',
                  fontWeight: isActive ? 'bold' : '500',
                }
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

// Chart Header Component
const ChartHeader = memo<{
  ticker: string;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}>(({ ticker, selectedPeriod, onPeriodChange }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.text }]}>
        {ticker.toUpperCase()} - Stock Price
      </Text>
      <Text style={[styles.subtitle, { color: theme.subtext }]}>
        Historical Price Movement
      </Text>
      
      <PeriodSelector 
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
    </View>
  );
});

// Price Info Component
const PriceInfoDisplay = memo<{
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  isLoading: boolean;
  hasValidData: boolean;
}>(({ currentPrice, priceChange, priceChangePercent, isLoading, hasValidData }) => {
  const { theme } = useTheme();

  const formatChange = useCallback((change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${safeCurrencyFormat(change)} (${sign}${percent.toFixed(2)}%)`;
  }, []);

  if (currentPrice <= 0) return null;

  return (
    <View style={[styles.priceInfo, { borderTopColor: theme.border }]}>
      <Text style={[styles.currentPrice, { color: theme.text }]}>
        {safeCurrencyFormat(currentPrice)}
      </Text>
      {!isLoading && hasValidData && (
        <Text style={[
          styles.priceChange,
          { color: priceChange >= 0 ? '#10B981' : '#EF4444' }
        ]}>
          {formatChange(priceChange, priceChangePercent)}
        </Text>
      )}
    </View>
  );
});

// Main Chart Renderer Component
const ChartRenderer = memo<{
  chartData: ChartData;
  chartConfig: any;
  height: number;
  screenWidth: number;
}>(({ chartData, chartConfig, height, screenWidth }) => {
  if (chartData.entries.length === 0) {
    return null;
  }

  return (
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
        segments={3}
        transparent={true}
        bezier={false}
      />
    </View>
  );
});

// Main TimeSeriesChart Component
const TimeSeriesChart: React.FC<TimeSeriesChartProps> = memo(({
  ticker,
  height = 220,
  currentPrice 
}) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');

  const screenWidth = useMemo(() => Dimensions.get('window').width, []);

  // Fetch time series data
  const { data: timeSeriesData, isLoading, isError } = useTimeSeries(ticker, selectedPeriod);

  // Process chart data
  const chartData = useChartData(timeSeriesData, selectedPeriod);
  
  // Chart configuration
  const chartConfig = useChartConfig(theme);

  // Resolve current price
  const resolvedCurrentPrice = useMemo(() => safeParseFloat(currentPrice), [currentPrice]);

  const handlePeriodChange = useCallback((period: TimePeriod) => {
    setSelectedPeriod(period);
  }, []);

  const hasValidData = chartData.entries.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <ChartHeader 
        ticker={ticker}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      />

      {/* Chart Area */}
      {isLoading ? (
        <ChartLoadingScreen height={height} />
      ) : isError || !hasValidData ? (
        <ChartErrorScreen height={height} ticker={ticker} />
      ) : (
        <ChartRenderer 
          chartData={chartData}
          chartConfig={chartConfig}
          height={height}
          screenWidth={screenWidth}
        />
      )}
      
      {/* Price Info */}
      <PriceInfoDisplay 
        currentPrice={resolvedCurrentPrice}
        priceChange={chartData.priceChange}
        priceChangePercent={chartData.priceChangePercent}
        isLoading={isLoading}
        hasValidData={hasValidData}
      />
    </View>
  );
});

// Styles
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
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
  periodButtonText: {
    fontSize: 12,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  lineChart: {
    borderRadius: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 8,
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 8,
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
  },
});

// Display names for debugging
ChartLoadingScreen.displayName = 'ChartLoadingScreen';
ChartErrorScreen.displayName = 'ChartErrorScreen';
PeriodSelector.displayName = 'PeriodSelector';
ChartHeader.displayName = 'ChartHeader';
PriceInfoDisplay.displayName = 'PriceInfoDisplay';
ChartRenderer.displayName = 'ChartRenderer';
TimeSeriesChart.displayName = 'TimeSeriesChart';

export default TimeSeriesChart;
export { TimeSeriesChart };