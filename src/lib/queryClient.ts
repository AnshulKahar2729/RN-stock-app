import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 1 day
      gcTime: 24 * 60 * 60 * 1000, // 1 day
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
