// components/TimeSeriesDailyChart.tsx
import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

type TimeSeriesDaily = Record<
  string,
  {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  }
>;

interface TimeSeriesDailyChartProps {
  data: TimeSeriesDaily;
  ticker: string;
  height?: number;
}

const TimeSeriesDailyChart: React.FC<TimeSeriesDailyChartProps> = ({
  data,
  ticker,
  height = 220
}) => {
  const screenWidth = Dimensions.get('window').width;

  const chartData = useMemo(() => {
    if (!data) return { labels: [], datasets: [{ data: [] }] };

    const entries = Object.entries(data)
      .map(([date, values]) => ({
        date,
        close: parseFloat(values['4. close']),
        formattedDate: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Show last 30 days

    return {
      labels: entries.map(entry => entry.formattedDate),
      datasets: [{
        data: entries.map(entry => entry.close),
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Blue color
        strokeWidth: 2
      }]
    };
  }, [data]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '0', // Hide dots
      strokeWidth: '0',
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <View style={{
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        margin: 16
      }}>
        <Text style={{ color: '#6b7280' }}>No data available for {ticker}</Text>
      </View>
    );
  }

  return (
    <View style={{ 
      backgroundColor: 'white', 
      borderRadius: 8, 
      padding: 16, 
      margin: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#1f2937',
        marginBottom: 4
      }}>
        {ticker.toUpperCase()} - Daily Price
      </Text>
      <Text style={{ 
        fontSize: 12, 
        color: '#6b7280',
        marginBottom: 16
      }}>
        Last 30 days
      </Text>
      
      <LineChart
        data={chartData}
        width={screenWidth - 64} // Account for margins
        height={height}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
        withDots={false}
        withInnerLines={false}
        withOuterLines={true}
      />
    </View>
  );
};

export default TimeSeriesDailyChart;

// Export for named import as well
export { TimeSeriesDailyChart };