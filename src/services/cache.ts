import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getCache<T>(key: string, duration: number): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  if (!value) return null;
  const { data, timestamp } = JSON.parse(value);
  if (Date.now() - timestamp > duration * 1000) return null;
  return data;
}

export async function setCache(key: string, data: any) {
  await AsyncStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
} 