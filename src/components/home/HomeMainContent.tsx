import React, { memo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, Dimensions } from 'react-native';
import { TopStock } from '../../types/stock';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';
import { HomeHeader } from '../HomeHeader';
import HomeStockSection from './HomeStockSection';

interface HomeMainContentProps {
  gainers: TopStock[];
  losers: TopStock[];
  gainersError: any;
  losersError: any;
  onRefresh: () => Promise<void>;
  onRetryGainers: () => void;
  onRetryLosers: () => void;
  onNavigateGainers: () => void;
  onNavigateLosers: () => void;
}

const HomeMainContent = memo<HomeMainContentProps>(({
  gainers,
  losers,
  gainersError,
  losersError,
  onRefresh,
  onRetryGainers,
  onRetryLosers,
  onNavigateGainers,
  onNavigateLosers,
}) => {
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  const handleRefresh = useCallback(async () => {
    await onRefresh();
  }, [onRefresh]);

  const handleNavigateGainers = useCallback(() => {
    onNavigateGainers();
  }, [onNavigateGainers]);

  const handleNavigateLosers = useCallback(() => {
    onNavigateLosers();
  }, [onNavigateLosers]);

  const handleRetryGainers = useCallback(() => {
    onRetryGainers();
  }, [onRetryGainers]);

  const handleRetryLosers = useCallback(() => {
    onRetryLosers();
  }, [onRetryLosers]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={false} // React Query handles its own loading states
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader />

        {/* Top Gainers Section */}
        <HomeStockSection
          title="Top Gainers"
          data={gainers}
          error={gainersError}
          onViewAllPress={handleNavigateGainers}
          onRetry={handleRetryGainers}
          keyPrefix="gainer"
        />

        {/* Top Losers Section */}
        <HomeStockSection
          title="Top Losers"
          data={losers}
          error={losersError}
          onViewAllPress={handleNavigateLosers}
          onRetry={handleRetryLosers}
          keyPrefix="loser"
        />
      </ScrollView>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      minHeight: Dimensions.get('window').height,
    },
    scrollView: {
      flex: 1,
    },
  });

HomeMainContent.displayName = 'HomeMainContent';

export default HomeMainContent; 