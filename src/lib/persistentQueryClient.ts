// src/lib/react-query/persistQueryClient.ts
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryClient } from './queryClient';

export const setupQueryClientPersistence = () => {
  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
  });

  persistQueryClient({
    queryClient,
    persister: asyncStoragePersister,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};
