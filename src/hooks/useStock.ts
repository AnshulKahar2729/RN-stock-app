import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { config } from '../utils/config';
import { StockOverview, TopStock, StockSearch } from '../types/stock';
import {
  getStaleTimeForTimeSeries,
  getApiParamsForTimeSeries,
} from '../utils/stock';
import { TimePeriod } from '../types/stock';
import { useMemo, useCallback } from 'react';

// Optimized fetch function for stock overview with better error handling
const fetchStockOverview = async (ticker: string): Promise<StockOverview> => {
  if (!ticker?.trim()) {
    throw new Error('Ticker symbol is required');
  }

  console.log('api key', config.API_KEY);
  
  try {
    const response = await axios.get(
      `${config.BASE_URL}?function=OVERVIEW&symbol=${ticker}&apikey=${config.API_KEY}`,
      {
        timeout: 10000, // 10 second timeout
      }
    );

    console.log('response', response);

    if (!response.data || Object.keys(response.data).length === 0) {
      throw new Error('No data found for stock overview');
    }

    // Check for API error messages
    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    if (response.data['Note']) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait and try again.');
      }
      if (error.response && error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
};

// Optimized hook with better configuration
export const useStockOverview = (ticker: string) => {
  console.log('ticker inside useStockOverview', ticker);

  // Memoize query options for better performance
  const queryOptions = useMemo(() => ({
    queryKey: ['stock-overviews', ticker],
    queryFn: () => fetchStockOverview(ticker),
    enabled: !!ticker?.trim(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days (previously cacheTime)
    retry: (failureCount: number, error: any) => {
      // Don't retry on client errors (4xx) except 429
      if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  }), [ticker]);

  return useQuery(queryOptions);
};

// Optimized fetch function for time series data
export const fetchTimeSeriesData = async (
  symbol: string,
  period: TimePeriod = '1M',
) => {
  if (!symbol?.trim()) {
    throw new Error('Symbol is required');
  }

  try {
    const params = getApiParamsForTimeSeries(symbol, period);
    const url = new URL(config.BASE_URL);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await axios.get(url.toString(), {
      timeout: 15000, // 15 second timeout for time series data
    });

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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait and try again.');
      }
      if (error.response && error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
};

// Enhanced hook for time series data with period support and better configuration
export const useTimeSeries = (symbol: string, period: TimePeriod = '1M') => {
  // Memoize query options
  const queryOptions = useMemo(() => ({
    queryKey: ['timeSeriesData', symbol, period],
    queryFn: () => fetchTimeSeriesData(symbol, period),
    staleTime: getStaleTimeForTimeSeries(period),
    gcTime: getStaleTimeForTimeSeries(period) * 2, // Cache longer than stale time
    retry: (failureCount: number, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!symbol?.trim(),
  }), [symbol, period]);

  return useQuery(queryOptions);
};

// Optimized fetch function for top gainers/losers
export async function fetchTopGainersLosers(
  type: 'gainers' | 'losers',
): Promise<TopStock[]> {
  if (!type || !['gainers', 'losers'].includes(type)) {
    throw new Error('Invalid type. Must be "gainers" or "losers"');
  }

  try {
    const url = new URL(config.BASE_URL);
    url.searchParams.append('function', 'TOP_GAINERS_LOSERS');
    url.searchParams.append('apikey', config.API_KEY);
    
    const response = await axios.get(url.toString(), {
      timeout: 10000, // 10 second timeout
    });
    
    const data = response.data;
    console.log('data', data);

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      throw new Error('API call frequency limit reached. Please try again later.');
    }

    const topStocks = type === 'gainers' ? data.top_gainers : data.top_losers;

    if (!Array.isArray(topStocks)) {
      throw new Error(`No ${type} data found in response`);
    }

    const stocks: TopStock[] = topStocks.map((stock: any) => ({
      change_amount: stock.change_amount || '0',
      change_percentage: stock.change_percentage || '0',
      price: stock.price || '0',
      ticker: stock.ticker || '',
      volume: stock.volume || '0',
    }));
    
    return stocks;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait and try again.');
      }
      if (error.response && error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
}

// Enhanced hook for top gainers/losers with better configuration
export const useGetTopGainersLosers = (type: 'gainers' | 'losers') => {
  // Memoize query options
  const queryOptions = useMemo(() => ({
    queryKey: ['topGainersLosers', type],
    queryFn: () => fetchTopGainersLosers(type),
    staleTime: 1000 * 60 * 60, // 1 hour (market data changes frequently)
    gcTime: 1000 * 60 * 60 * 6, // 6 hours cache time
    retry: (failureCount: number, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!type && ['gainers', 'losers'].includes(type),
  }), [type]);

  return useQuery(queryOptions);
};

// Optimized search stocks function
export async function fetchStockSearch(query: string): Promise<StockSearch[]> {
  const trimmedQuery = query?.trim();
  
  if (!trimmedQuery) {
    return [];
  }

  if (trimmedQuery.length < 1) {
    return [];
  }

  try {
    const url = new URL(config.BASE_URL);
    url.searchParams.append('function', 'SYMBOL_SEARCH');
    url.searchParams.append('keywords', trimmedQuery);
    url.searchParams.append('apikey', config.API_KEY);

    const response = await axios.get(url.toString(), {
      timeout: 8000, // 8 second timeout for search
    });
    
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
      symbol: stock['1. symbol'] || '',
      name: stock['2. name'] || '',
      type: stock['3. type'] || '',
      region: stock['4. region'] || '',
      marketOpen: stock['5. marketOpen'] || '',
      marketClose: stock['6. marketClose'] || '',
      timezone: stock['7. timezone'] || '',
      currency: stock['8. currency'] || '',
      matchScore: stock['9. matchScore'] || '0',
    }));

        return stocks;
   } catch (error) {
     if (axios.isAxiosError(error)) {
       if (error.code === 'ECONNABORTED') {
         throw new Error('Search timeout. Please try again.');
       }
       if (error.response?.status === 429) {
         throw new Error('Too many requests. Please wait and try again.');
       }
       if (error.response && error.response.status >= 500) {
         throw new Error('Server error. Please try again later.');
       }
     }
     throw error;
   }
}

// Enhanced search hook with debouncing and better configuration
export const useStockSearch = (query: string) => {
  // Memoize query options
  const queryOptions = useMemo(() => ({
    queryKey: ['stockSearch', query],
    queryFn: () => fetchStockSearch(query),
    enabled: !!query?.trim() && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache time
    retry: (failureCount: number, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500 && error?.response?.status !== 429) {
        return false;
      }
      return failureCount < 2; // Less retries for search
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 15000),
  }), [query]);

  return useQuery(queryOptions);
};
