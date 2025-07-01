import { TopStock } from '../types/stock';
import { config } from '../utils/config';
import axios from 'axios';
import { getCache, setCache } from './cache';

const cacheDuration = 60 * 60 * 24; // 1 day
const { API_KEY, BASE_URL } = config;

export async function fetchTopGainers(): Promise<TopStock[]> {
  const cacheKey = 'top_gainers';
  const cached = await getCache<TopStock[]>(cacheKey, cacheDuration);
  console.log({ cached });
  if (cached) return cached;

  const { data } = await axios.get(
    `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`,
  );

  console.log({ data });

  // Map data to Stock[]
  const stocks: TopStock[] = data.top_gainers.map((stock: any) => ({
    change_amount: stock.change_amount,
    change_percentage: stock.change_percentage,
    price: stock.price,
    ticker: stock.ticker,
    volume: stock.volume,
  }));
  await setCache(cacheKey, stocks);
  return stocks;
}

export async function fetchTopLosers(): Promise<TopStock[]> {
  const cacheKey = 'top_losers';
  const cached = await getCache<TopStock[]>(cacheKey, cacheDuration);
  if (cached) return cached;

  const { data } = await axios.get(
    `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`,
  );

  // Map data to Stock[]
  const stocks: TopStock[] = data.top_losers.map((stock: any) => ({
    change_amount: stock.change_amount,
    change_percentage: stock.change_percentage,
    price: stock.price,
    ticker: stock.ticker,
    volume: stock.volume,
  }));
  await setCache(cacheKey, stocks);
  return stocks;
}
