import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Theme } from '../../utils';
import { useTheme } from '../../context/ThemeContext';
import { useGetTopGainersLosers } from '../../hooks/useStock';

// Import the new components
import ViewAllHeader from '../../components/viewall/ViewAllHeader';
import ViewAllStockList from '../../components/viewall/ViewAllStockList';
import PaginationControls from '../../components/viewall/PaginationControls';

const PAGE_SIZE = 10;

const ViewAllScreen: React.FC = memo(() => {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<{ params: { type: 'gainers' | 'losers' } }, 'params'>>();
  const [page, setPage] = useState(1);
  const { theme, mode } = useTheme();
  const [progressAnim] = useState(new Animated.Value(0));

  const {
    data: stocks = [],
    isLoading,
    isError,
  } = useGetTopGainersLosers(route.params.type);

  // Memoized calculations
  const { paginatedStocks, totalPages, startItem, endItem } = useMemo(() => {
    const paginated = stocks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const total = Math.ceil(stocks.length / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, stocks.length);

    return {
      paginatedStocks: paginated,
      totalPages: total,
      startItem: start,
      endItem: end,
    };
  }, [stocks, page]);

  const { canGoPrevious, canGoNext } = useMemo(() => ({
    canGoPrevious: page > 1,
    canGoNext: page < totalPages,
  }), [page, totalPages]);

  const title = useMemo(() => 
    route.params.type === 'gainers' ? 'Top Gainers' : 'Top Losers',
    [route.params.type]
  );

  // Animation effect
  useEffect(() => {
    const progress = totalPages > 0 ? page / totalPages : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [page, totalPages, progressAnim]);

  // Memoized handlers
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePreviousPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage(prev => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  return (
    <View style={getStyles(theme).container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      <ViewAllHeader title={title} onBackPress={handleBackPress} />

      <View style={getStyles(theme).contentContainer}>
        <View style={getStyles(theme).listContainer}>
          <ViewAllStockList 
            data={paginatedStocks}
            isLoading={isLoading}
            isError={isError}
            type={route.params.type}
          />
        </View>

        <PaginationControls
          page={page}
          totalPages={totalPages}
          startItem={startItem}
          endItem={endItem}
          totalItems={stocks.length}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          progressAnim={progressAnim}
        />
      </View>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    listContainer: {
      flex: 1,
    },
  });

ViewAllScreen.displayName = 'ViewAllScreen';

export default ViewAllScreen; 