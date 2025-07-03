import React, { useCallback, memo } from 'react';
import { useGetTopGainersLosers } from '../../hooks/useStock';
import { useNavigation } from '@react-navigation/native';

// Import the new components
import HomeLoadingScreen from '../../components/home/HomeLoadingScreen';
import HomeMainContent from '../../components/home/HomeMainContent';

const HomeScreen = memo(() => {
  const navigation = useNavigation<any>();

  const {
    data: gainers = [],
    isLoading: gainersLoading,
    error: gainersError,
    refetch: refetchGainers,
  } = useGetTopGainersLosers('gainers');

  const {
    data: losers = [],
    isLoading: losersLoading,
    error: losersError,
    refetch: refetchLosers,
  } = useGetTopGainersLosers('losers');

  // Combine loading states
  const loading = gainersLoading || losersLoading;

  // Memoized navigation handlers
  const navigateToViewAll = useCallback(
    (type: 'gainers' | 'losers') => {
      navigation?.navigate?.('ViewAll', { type });
    },
    [navigation],
  );

  const navigateToGainers = useCallback(() => {
    navigateToViewAll('gainers');
  }, [navigateToViewAll]);

  const navigateToLosers = useCallback(() => {
    navigateToViewAll('losers');
  }, [navigateToViewAll]);

  // Handle refresh - refetch both queries
  const onRefresh = useCallback(async () => {
    await Promise.all([refetchGainers(), refetchLosers()]);
  }, [refetchGainers, refetchLosers]);

  // Handle retry for errors
  const handleRetryGainers = useCallback(() => {
    refetchGainers();
  }, [refetchGainers]);

  const handleRetryLosers = useCallback(() => {
    refetchLosers();
  }, [refetchLosers]);

  if (loading) {
    return <HomeLoadingScreen />;
  }

  return (
    <HomeMainContent
      gainers={gainers}
      losers={losers}
      gainersError={gainersError}
      losersError={losersError}
      onRefresh={onRefresh}
      onRetryGainers={handleRetryGainers}
      onRetryLosers={handleRetryLosers}
      onNavigateGainers={navigateToGainers}
      onNavigateLosers={navigateToLosers}
    />
  );
});

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
