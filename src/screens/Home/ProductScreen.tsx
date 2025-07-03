import React, { memo, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useStockOverview } from '../../hooks/useStock';
import { safeParseFloat } from '../../utils';
import { TimeSeriesChart } from '../../components/TimeSeriesChart';
import { useTheme } from '../../context/ThemeContext';
import AddToWatchlistSheet, {
  AddToWatchlistSheetRef,
} from '../../components/AddToWatchlistSheet';
import { TopStock } from '../../types/stock';

// Import the new components
import ProductLoadingScreen from '../../components/product/ProductLoadingScreen';
import ProductErrorScreen from '../../components/product/ProductErrorScreen';
import ProductHeader from '../../components/product/ProductHeader';
import QuickStats from '../../components/product/QuickStats';
import PriceRange from '../../components/product/PriceRange';
import KeyMetrics from '../../components/product/KeyMetrics';
import CompanyInfo from '../../components/product/CompanyInfo';
import FinancialRatios from '../../components/product/FinancialRatios';
import CompanyDescription from '../../components/product/CompanyDescription';

const ProductScreen = memo(() => {
  const route = useRoute<RouteProp<{ params: { ticker: string } }, 'params'>>();
  const { ticker } = route.params;
  const { data: overview, isLoading, isError } = useStockOverview(ticker);
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);
  const watchlistSheetRef = useRef<AddToWatchlistSheetRef>(null);

  // Get the current price safely
  const getCurrentPrice = useMemo(() => {
    if (!overview) return '';

    const priceFields = [
      overview['50DayMovingAverage'],
      overview['200DayMovingAverage'],
      overview['52WeekHigh'],
      overview['BookValue'],
      overview['AnalystTargetPrice'],
    ];
    
    for (const field of priceFields) {
      const price = safeParseFloat(field);
      if (price > 0) {
        return String(price);
      }
    }

    return '';
  }, [overview]);

  // Construct a minimal TopStock object from available data
  const stock: TopStock = useMemo(() => ({
    ticker,
    price: getCurrentPrice,
    change_amount: '', 
    change_percentage: '', 
    volume: '',
  }), [ticker, getCurrentPrice]);

  const handleBookmarkPress = useCallback(() => {
    watchlistSheetRef.current?.show();
  }, []);

  const handleCloseWatchlistSheet = useCallback(() => {
    watchlistSheetRef.current?.hide();
  }, []);

  if (isLoading) {
    return <ProductLoadingScreen />;
  }

  if (isError) {
    return <ProductErrorScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <ProductHeader
          ticker={ticker}
          companyName={overview?.Name}
          onBookmarkPress={handleBookmarkPress}
        />

        {/* Chart Section */}
        <TimeSeriesChart ticker={ticker} currentPrice={getCurrentPrice} />

        {/* Quick Stats */}
        {overview && <QuickStats overview={overview} />}

        {/* Price Range */}
        {overview && (
          <PriceRange overview={overview} currentPrice={getCurrentPrice} />
        )}

        {/* Key Metrics */}
        {overview && <KeyMetrics overview={overview} />}

        {/* Company Info */}
        {overview && <CompanyInfo overview={overview} />}

        {/* Financial Ratios */}
        {overview && <FinancialRatios overview={overview} />}

        {/* Company Description */}
        {overview?.Description && (
          <CompanyDescription description={overview.Description} />
        )}
      </ScrollView>

      {/* AddToWatchlistSheet Bottom Sheet */}
      <AddToWatchlistSheet
        ref={watchlistSheetRef}
        stock={stock}
        onClose={handleCloseWatchlistSheet}
      />
    </SafeAreaView>
  );
});

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: 20,
    },
  });

ProductScreen.displayName = 'ProductScreen';

export default ProductScreen;