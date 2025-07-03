import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { config } from '../utils/config';
import { StockOverview, TopStock, StockSearch } from '../types/stock';
import {
  getStaleTimeForTimeSeries,
  getApiParamsForTimeSeries,
} from '../utils/stock';
import { TimePeriod } from '../types/stock';

const fetchStockOverview = async (ticker: string): Promise<StockOverview> => {
  console.log('api key', config.API_KEY);
  const response = await axios.get(
    `${config.BASE_URL}?function=OVERVIEW&symbol=${ticker}&apikey=${config.API_KEY}`,
  );

  console.log('response', response);

  if (!response.data || Object.keys(response.data).length === 0) {
    throw new Error('No data found for stock overview');
  }

  return response.data;
};

export const useStockOverview = (ticker: string) => {
  console.log('ticker inside useStockOverview', ticker);
  return useQuery({
    queryKey: ['stock-overviews', ticker],
    queryFn: () => fetchStockOverview(ticker),
    enabled: !!ticker,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Fetch time series data for different periods
export const fetchTimeSeriesData = async (
  symbol: string,
  period: TimePeriod = '1M',
) => {
  const params = getApiParamsForTimeSeries(symbol, period);
  const url = new URL(config.BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await axios.get(url.toString());

  const data = response.data;

  console.log('data', data);

  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  if (data['Note']) {
    throw new Error(
      'API call frequency limit reached. Please try again later.',
    );
  }

  // Extract time series data based on function type
  let timeSeriesData;
  if (data['Time Series (5min)']) {
    timeSeriesData = data['Time Series (5min)'];
  } else if (data['Time Series (Daily)']) {
    timeSeriesData = data['Time Series (Daily)'];
  } else if (data['Weekly Time Series']) {
    timeSeriesData = data['Weekly Time Series'];
  } else {
    throw new Error('No time series data found in response');
  }

  return {
    metadata: data['Meta Data'],
    timeSeries: timeSeriesData,
  };
};

// Enhanced hook for time series data with period support
export const useTimeSeries = (symbol: string, period: TimePeriod = '1M') => {
  return useQuery({
    queryKey: ['timeSeriesData', symbol, period],
    queryFn: () => fetchTimeSeriesData(symbol, period),
    staleTime: getStaleTimeForTimeSeries(period),
    retry: 3,
    enabled: !!symbol,
  });
};

export async function fetchTopGainersLosers(
  type: 'gainers' | 'losers',
): Promise<TopStock[]> {
  const url = new URL(config.BASE_URL);
  url.searchParams.append('function', 'TOP_GAINERS_LOSERS');
  url.searchParams.append('apikey', config.API_KEY);
  const response = await axios.get(url.toString());
  const data = response.data;

  console.log('data', data);

  const topStocks = type === 'gainers' ? data.top_gainers : data.top_losers;

  const stocks: TopStock[] = topStocks.map((stock: any) => ({
    change_amount: stock.change_amount,
    change_percentage: stock.change_percentage,
    price: stock.price,
    ticker: stock.ticker,
    volume: stock.volume,
  }));
  return stocks;
}
export const useGetTopGainersLosers = (type: 'gainers' | 'losers') => {
  return useQuery({
    queryKey: ['topGainersLosers', type],
    queryFn: () => fetchTopGainersLosers(type),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Search stocks by symbol or company name
export async function fetchStockSearch(query: string): Promise<StockSearch[]> {
  if (!query.trim()) {
    return [];
  }

  const url = new URL(config.BASE_URL);
  url.searchParams.append('function', 'SYMBOL_SEARCH');
  url.searchParams.append('keywords', query.trim());
  url.searchParams.append('apikey', config.API_KEY);

  const response = await axios.get(url.toString());
  const data = response.data;

  console.log('Search response:', data);

  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  if (data['Note']) {
    throw new Error(
      'API call frequency limit reached. Please try again later.',
    );
  }

  const searchResults = data.bestMatches || [];

  const stocks: StockSearch[] = searchResults.map((stock: any) => ({
    symbol: stock['1. symbol'],
    name: stock['2. name'],
    type: stock['3. type'],
    region: stock['4. region'],
    marketOpen: stock['5. marketOpen'],
    marketClose: stock['6. marketClose'],
    timezone: stock['7. timezone'],
    currency: stock['8. currency'],
    matchScore: stock['9. matchScore'],
  }));

  return stocks;
}

export const useStockSearch = (query: string) => {
  return useQuery({
    queryKey: ['stockSearch', query],
    queryFn: () => fetchStockSearch(query),
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
