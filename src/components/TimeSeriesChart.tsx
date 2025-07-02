// components/TimeSeriesChart.tsx - Fixed Version
import React, { useMemo, useState } from 'react';
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
    position: 'relative',
  },
  chartLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 20,
  },
  chartLoadingText: {
    marginTop: 12,
    fontSize: theme.font.size.sm,
    color: theme.subtext,
  },
  chartErrorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 20,
  },
  chartErrorText: {
    fontSize: theme.font.size.sm,
    color: theme.subtext,
    textAlign: 'center',
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
  // Tooltip styles for React Native View
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: theme.background,
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.border || 'rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  tooltipDate: {
    fontSize: 12,
    color: theme.subtext,
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
  },
});

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  ticker,
  height = 220,
  currentPrice // Accept current price from parent
}) => {
  const screenWidth = Dimensions.get('window').width;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1M');
  
  // Fetch data based on selected period
  const { data: timeSeriesData, isLoading, isError } = useTimeSeries(ticker, selectedPeriod);
  
  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    index: number;
    value: number;
    x: number;
    y: number;
    date: string;
  } | null>(null);

  // Use the passed currentPrice or fallback to calculating from latest data
  const resolvedCurrentPrice = useMemo(() => {
    if (currentPrice) {
      return safeParseFloat(currentPrice);
    }

    // Fallback: get from latest time series data
    const data = timeSeriesData?.timeSeries || {};
    if (Object.keys(data).length === 0) return 0;

    try {
      const latestEntry = Object.entries(data)
        .map(([date, values]) => {
          const timeSeriesValues = values as {
            '1. open': string;
            '2. high': string;
            '3. low': string;
            '4. close': string;
            '5. volume': string;
          };
          return {
            date,
            close: safeParseFloat(timeSeriesValues['4. close']),
            timestamp: new Date(date).getTime()
          };
        })
        .filter(entry => entry.close > 0 && !isNaN(entry.timestamp))
        .sort((a, b) => b.timestamp - a.timestamp)[0]; // Get most recent

      return latestEntry?.close || 0;
    } catch (error) {
      return 0;
    }
  }, [currentPrice, timeSeriesData]);

  const processedData = useMemo(() => {
    const data = timeSeriesData?.timeSeries || {};
    
    if (!data || Object.keys(data)?.length === 0) {
      return { entries: [], hasValidData: false };
    }

    const selectedDays = TIME_PERIODS.find(p => p.label === selectedPeriod)?.days || 30;
    
    try {
      // Get and sort all entries, filtering out invalid data
      const allEntries = Object.entries(data)
        .map(([date, values]) => {
          const timeSeriesValues = values as {
            '1. open': string;
            '2. high': string;
            '3. low': string;
            '4. close': string;
            '5. volume': string;
          };
          const closePrice = safeParseFloat(timeSeriesValues['4. close']);
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

      if (allEntries?.length === 0) {
        return { entries: [], hasValidData: false };
      }

      // For 1D (intraday), show all available data
      // For other periods, filter by days
      let entries;
      if (selectedPeriod === '1D') {
        entries = allEntries;
      } else {
        entries = allEntries.slice(-Math.min(selectedDays, allEntries.length));
      }
      
      return { entries, hasValidData: entries.length > 0 };
    } catch (error) {
      console.error('Error processing chart data:', error);
      return { entries: [], hasValidData: false };
    }
  }, [timeSeriesData, selectedPeriod]);

  const chartData = useMemo(() => {
    if (!processedData.hasValidData || processedData.entries.length === 0) {
      return { 
        labels: [''], 
        datasets: [{ data: [0] }],
        priceChange: 0,
        priceChangePercent: 0,
      };
    }

    const { entries } = processedData;
    
    // Format dates for labels
    const formatDate = (timestamp: number) => {
      try {
        const date = new Date(timestamp);
        if (selectedPeriod === '1D') {
          return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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
      const labelCount = selectedPeriod === '1D' ? 4 : 3;
      const step = Math.floor(entries.length / (labelCount - 1));
      
      for (let i = 0; i < entries.length; i++) {
        if (i === 0 || i === entries.length - 1 || i % step === 0) {
          labels.push(formatDate(entries[i].timestamp));
        } else {
          labels.push('');
        }
      }
    }

    // Calculate price change from the first price in the period to current price
    const firstPrice = prices[0] || resolvedCurrentPrice;
    const priceChange = resolvedCurrentPrice - firstPrice;
    const priceChangePercent = firstPrice !== 0 ? (priceChange / firstPrice) * 100 : 0;

    return {
      labels: labels.length > 0 ? labels : [''],
      datasets: [{
        data: prices.length > 0 ? prices : [0],
        color: (opacity = 1) => priceChange >= 0 
          ? `rgba(16, 185, 129, ${opacity})` 
          : `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2.5
      }],
      priceChange,
      priceChangePercent,
    };
  }, [processedData, selectedPeriod, resolvedCurrentPrice]);

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

  // Handler for line hover/touch move
  const handleChartTouchMove = (event: any) => {
    if (!processedData.entries.length) return;
    
    const chartWidth = screenWidth - 64;
    const chartPadding = 40;
    const dataWidth = chartWidth - (chartPadding * 2);
    
    const touchX = event.nativeEvent.locationX;
    const relativeX = touchX - chartPadding;
    
    if (relativeX < 0 || relativeX > dataWidth) {
      setTooltip(null);
      return;
    }
    
    const dataPoints = processedData.entries.length;
    const pointWidth = dataWidth / (dataPoints - 1);
    const closestIndex = Math.round(relativeX / pointWidth);
    
    if (closestIndex >= 0 && closestIndex < dataPoints) {
      const entry = processedData.entries[closestIndex];
      const value = entry.close;
      
      const tooltipWidth = 120;
      const tooltipHeight = 60;
      const chartMargin = 32;
      
      let x = touchX - tooltipWidth / 2;
      let y = event.nativeEvent.locationY - tooltipHeight - 20;
      
      if (x < chartMargin) x = chartMargin;
      if (x + tooltipWidth > screenWidth - chartMargin) x = screenWidth - chartMargin - tooltipWidth;
      if (y < 0) y = event.nativeEvent.locationY + 20;
      
      setTooltip({
        index: closestIndex,
        value,
        x,
        y,
        date: entry.date,
      });
    }
  };

  const handleChartTouchEnd = () => {
    setTimeout(() => {
      setTooltip(null);
    }, 1500);
  };

  // Render the chart area with loading/error states
  const renderChartArea = () => {
    if (isLoading) {
      return (
        <View style={[styles.chartLoadingContainer, { height }]}>
          <ActivityIndicator size="large" color={theme.primary || '#007AFF'} />
          <Text style={styles.chartLoadingText}>Loading chart data...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={[styles.chartErrorContainer, { height }]}>
          <Text style={styles.chartErrorText}>Error loading chart data</Text>
        </View>
      );
    }

    if (!processedData.hasValidData) {
      return (
        <View style={[styles.chartErrorContainer, { height }]}>
          <Text style={styles.chartErrorText}>No chart data available for {ticker}</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartWrapper}>
        <View
          style={{ position: 'relative' }}
          onTouchMove={handleChartTouchMove}
          onTouchEnd={handleChartTouchEnd}
          onTouchCancel={() => setTooltip(null)}
        >
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
        
        {/* Tooltip */}
        {tooltip && (
          <View
            style={[
              styles.tooltipContainer,
              {
                left: tooltip.x,
                top: tooltip.y,
              }
            ]}
          >
            <Text style={styles.tooltipDate}>
              {tooltip.date ? (() => {
                const date = new Date(tooltip.date);
                if (selectedPeriod === '1D') {
                  return date.toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  });
                } else {
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: '2-digit' 
                  });
                }
              })() : ''}
            </Text>
            <Text style={styles.tooltipValue}>
              {safeCurrencyFormat(tooltip.value)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.chartTitle}>
          {ticker.toUpperCase()} - Stock Price
        </Text>
        <Text style={styles.chartSubtitle}>
          Historical Price Movement
        </Text>
        
        {/* Time Period Selector - Always visible */}
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

      {/* Chart Area - Shows loading/error states only in this section */}
      {renderChartArea()}
      
      {/* Price Info - Always show current price if available */}
      {resolvedCurrentPrice > 0 && (
        <View style={styles.priceInfo}>
          <Text style={styles.currentPrice}>
            {safeCurrencyFormat(resolvedCurrentPrice)}
          </Text>
          {!isLoading && processedData.hasValidData && (
            <Text style={[
              styles.priceChangeText,
              chartData.priceChange >= 0 
                ? styles.priceChangePositive 
                : styles.priceChangeNegative
            ]}>
              {formatChange(chartData.priceChange, chartData.priceChangePercent)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default TimeSeriesChart;
export { TimeSeriesChart };