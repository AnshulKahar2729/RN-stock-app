import { TimePeriod } from '../types/stock';
import { config } from './config';

// to determine cache duration based on period
export const getStaleTimeForTimeSeries = (period: TimePeriod): number => {
  switch (period) {
    case '1D':
      return 1000 * 60 * 5; // 5 minutes for intraday
    case '1W':
    case '1M':
      return 1000 * 60 * 30; // 30 minutes for short-term
    case '3M':
    case '6M':
      return 1000 * 60 * 60; // 1 hour for medium-term
    case '1Y':
    case '5Y':
      return 1000 * 60 * 60 * 4; // 4 hours for long-term
    default:
      return 1000 * 60 * 30; // 30 minutes default
  }
};

// Alpha Vantage API endpoints mapping
export const getApiFunctionForTimeSeries = (period: TimePeriod) => {
  switch (period) {
    case '1D':
      return 'TIME_SERIES_INTRADAY'; // 5min intervals for 1 day
    case '1W':
    case '1M':
      return 'TIME_SERIES_DAILY'; // Daily data
    case '3M':
    case '6M':
    case '1Y':
      return 'TIME_SERIES_DAILY'; // Daily data
    case '5Y':
      return 'TIME_SERIES_WEEKLY'; // Weekly data for 5 years
    default:
      return 'TIME_SERIES_DAILY';
  }
};
export const getApiParamsForTimeSeries = (
  symbol: string,
  period: TimePeriod,
) => {
  const baseParams = {
    apikey: config.API_KEY,
    symbol: symbol,
  };

  const func = getApiFunctionForTimeSeries(period);

  if (func === 'TIME_SERIES_INTRADAY') {
    return {
      ...baseParams,
      function: func,
      interval: '5min',
      outputsize: 'compact', // Last 100 data points
    };
  } else if (func === 'TIME_SERIES_WEEKLY') {
    return {
      ...baseParams,
      function: func,
    };
  } else {
    return {
      ...baseParams,
      function: func,
      outputsize: period === '5Y' ? 'full' : 'compact',
    };
  }
};
