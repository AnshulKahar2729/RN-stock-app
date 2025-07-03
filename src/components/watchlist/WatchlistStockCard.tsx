import React, { memo } from 'react';
import { useStockOverview } from '../../hooks/useStock';
import StockCard from '../TopStockCard';

interface WatchlistStockCardProps {
  ticker: string;
}

const WatchlistStockCard = memo<WatchlistStockCardProps>(({ ticker }) => {
  const { data: overview, isLoading: isOverviewLoading } = useStockOverview(ticker);
  const { data: timeSeriesData, isLoading: isTimeSeriesLoading } =
    require('../../hooks/useStock').useTimeSeries(ticker, '1M');

  if (isOverviewLoading || isTimeSeriesLoading || !overview || !timeSeriesData)
    return null;

  // Get current price logic
  const getCurrentPrice = () => {
    if (!overview) return '';
    const priceFields = [
      overview['50DayMovingAverage'],
      overview['200DayMovingAverage'],
      overview['52WeekHigh'],
      overview['BookValue'],
    ];
    for (const field of priceFields) {
      if (field && !isNaN(Number(field)) && Number(field) > 0) {
        return String(field);
      }
    }
    return '';
  };

  // Calculate change_amount and change_percentage from time series data (1M)
  const safeParseFloat = (
    value: string | number | null | undefined,
  ): number => {
    if (value === null || value === undefined || value === '') return 0;
    const str = String(value).trim();
    if (
      str === 'N/A' ||
      str === 'NaN' ||
      str === 'None' ||
      str === '--' ||
      str === 'null' ||
      str === 'undefined'
    ) {
      return 0;
    }
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  };

  type TimeSeriesValue = {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };

  // Extract and sort close prices by date ascending
  const entries = Object.entries(timeSeriesData.timeSeries || {})
    .map(([date, values]) => {
      const v = values as TimeSeriesValue;
      const close = safeParseFloat(v['4. close']);
      const timestamp = new Date(date).getTime();
      if (close > 0 && !isNaN(timestamp)) {
        return { date, close, timestamp };
      }
      return null;
    })
    .filter(
      (entry): entry is { date: string; close: number; timestamp: number } =>
        entry !== null,
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  let change_amount = '';
  let change_percentage = '';
  if (entries.length > 1) {
    const currentPrice = entries[entries.length - 1].close;
    const previousPrice = entries[0].close;
    const change = currentPrice - previousPrice;
    const percent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;
    change_amount = change.toFixed(2);
    change_percentage = percent.toFixed(2);
  }

  const stock = {
    ticker,
    price: getCurrentPrice(),
    change_amount,
    change_percentage,
    volume: '',
  };

  return <StockCard stock={stock} />;
});

WatchlistStockCard.displayName = 'WatchlistStockCard';

export default WatchlistStockCard; 