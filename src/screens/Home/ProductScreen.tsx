import React, { memo, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStockOverview } from '../../hooks/useStock';
import {
  formatCurrency,
  formatPercentage,
  formatValue,
  Theme,
  safeParseFloat,
} from '../../utils';
import { TimeSeriesChart } from '../../components/TimeSeriesChart';
import { useTheme } from '../../context/ThemeContext';
import AddToWatchlistSheet, {
  AddToWatchlistSheetRef,
} from '../../components/AddToWatchlistSheet';
import { TopStock } from '../../types/stock';
import { useWatchlist } from '../../context/WatchlistContext';

const ProductScreen = () => {
  const route = useRoute<RouteProp<{ params: { ticker: string } }, 'params'>>();
  const { ticker } = route.params;
  const { data: overview, isLoading, isError } = useStockOverview(ticker);
  console.log('overview', overview);
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);
  const watchlistSheetRef = useRef<AddToWatchlistSheetRef>(null);
  const { watchlists } = useWatchlist();

  // Get the current price safely - using correct StockOverview properties
  const getCurrentPrice = useMemo(() => {
    if (!overview) return '';

    // Priority order for getting current price using actual available properties
    const priceFields = [
      overview['50DayMovingAverage'], // 50-day moving average (most current estimate)
      overview['200DayMovingAverage'], // 200-day moving average
      overview['52WeekHigh'], // 52-week high as reference
      overview['BookValue'], // Book value per share
      overview['AnalystTargetPrice'], // Analyst target price as fallback
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
    change_amount: '', // You can enhance this with real data if available
    change_percentage: '', // You can enhance this with real data if available
    volume: '', // You can enhance this with real data if available
  }), [ticker, getCurrentPrice]);

  // Check if the stock is already in any watchlist
  const isInWatchlist = useMemo(() => 
    watchlists.some(watchlist =>
      watchlist.tickers?.some(stock => stock === ticker)
    ), [watchlists, ticker]
  );

  const handleBookmarkPress = useCallback(() => {
    watchlistSheetRef.current?.show();
  }, []);

  const handleCloseWatchlistSheet = useCallback(() => {
    watchlistSheetRef.current?.hide();
  }, []);

  const getCurrentPricePosition = useCallback(() => {
    const currentPrice = safeParseFloat(getCurrentPrice);
    const low = safeParseFloat(overview?.['52WeekLow']);
    const high = safeParseFloat(overview?.['52WeekHigh']);

    if (!currentPrice || !low || !high || high <= low) return 50;

    const position = ((currentPrice - low) / (high - low)) * 100;
    return Math.max(0, Math.min(100, position));
  }, [getCurrentPrice, overview]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading stock data</Text>
        </View>
      </SafeAreaView>
    );
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
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.ticker}>{ticker.toUpperCase()}</Text>
            {overview?.Name && (
              <Text style={styles.companyName} numberOfLines={2}>
                {overview.Name}
              </Text>
            )}
          </View>

          {/* Bookmark icon */}
          <TouchableOpacity
            style={styles.bookmarkIcon}
            onPress={handleBookmarkPress}
            activeOpacity={0.7}
          >
            <Icon
              name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isInWatchlist ? theme.primary || '#007AFF' : theme.text}
            />
          </TouchableOpacity>
        </View>

        {/* Chart Section - Pass current price to ensure consistency */}
        <TimeSeriesChart ticker={ticker} currentPrice={getCurrentPrice} />

        {/* Quick Stats - Using correct StockOverview properties */}
        {overview && (
          <View style={styles.quickStatsContainer}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>Market Cap</Text>
              <Text style={styles.quickStatValue}>
                {formatCurrency(overview.MarketCapitalization)}
              </Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>P/E Ratio</Text>
              <Text style={styles.quickStatValue}>
                {formatValue(overview.PERatio)}
              </Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>52W High</Text>
              <Text style={styles.quickStatValue}>
                {formatCurrency(overview['52WeekHigh'])}
              </Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>52W Low</Text>
              <Text style={styles.quickStatValue}>
                {formatCurrency(overview['52WeekLow'])}
              </Text>
            </View>
          </View>
        )}

        {/* Price Range with Visual Bar */}
        <View style={styles.section}>
          <SectionHeader title="Price Range" icon="trending-up-outline" />
          <View style={styles.priceRangeVisualContainer}>
            <View style={styles.priceLabelsRow}>
              <Text style={styles.priceLabelText}>
                {formatCurrency(overview?.['52WeekLow'])}
              </Text>
              <Text style={styles.priceLabelText}>
                {formatCurrency(overview?.['52WeekHigh'])}
              </Text>
            </View>

            <View style={styles.priceBarContainer}>
              <View style={styles.priceBar} />
              <View
                style={[
                  styles.currentPriceIndicator,
                  {
                    left: `${getCurrentPricePosition()}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.currentPriceLabel}>
              <Text style={styles.currentPriceLabelText}>
                Current: {formatCurrency(getCurrentPrice)}
              </Text>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <SectionHeader title="Key Metrics" icon="bar-chart-outline" />
          <DataRow
            label="Market Cap"
            value={formatCurrency(overview?.MarketCapitalization)}
            icon="business-outline"
          />
          <DataRow
            label="P/E Ratio"
            value={formatValue(overview?.PERatio)}
            icon="calculator-outline"
          />
          <DataRow
            label="Beta"
            value={formatValue(overview?.Beta)}
            icon="pulse-outline"
          />
          <DataRow
            label="Dividend Yield"
            value={formatPercentage(overview?.DividendYield)}
            icon="cash-outline"
          />
          <DataRow
            label="Profit Margin"
            value={formatPercentage(overview?.ProfitMargin)}
            icon="trending-up-outline"
          />
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <SectionHeader
            title="Company Information"
            icon="information-circle-outline"
          />
          <DataRow
            label="Sector"
            value={formatValue(overview?.Sector)}
            icon="layers-outline"
          />
          <DataRow
            label="Industry"
            value={formatValue(overview?.Industry)}
            icon="construct-outline"
          />
          <DataRow
            label="Country"
            value={formatValue(overview?.Country)}
            icon="location-outline"
          />
          <DataRow
            label="Exchange"
            value={formatValue(overview?.Exchange)}
            icon="swap-horizontal-outline"
          />
          <DataRow
            label="Currency"
            value={formatValue(overview?.Currency)}
            icon="card-outline"
          />
        </View>

        {/* Financial Ratios */}
        <View style={styles.section}>
          <SectionHeader title="Financial Ratios" icon="analytics-outline" />
          <DataRow
            label="EPS"
            value={formatValue(overview?.EPS)}
            icon="stats-chart-outline"
          />
          <DataRow
            label="Book Value"
            value={formatValue(overview?.BookValue)}
            icon="library-outline"
          />
          <DataRow
            label="ROE (TTM)"
            value={formatPercentage(overview?.ReturnOnEquityTTM)}
            icon="arrow-up-circle-outline"
          />
          <DataRow
            label="ROA (TTM)"
            value={formatPercentage(overview?.ReturnOnAssetsTTM)}
            icon="pie-chart-outline"
          />
        </View>

        {/* Company Description */}
        {overview?.Description && (
          <View style={styles.section}>
            <SectionHeader title="About" icon="document-text-outline" />
            <Text style={styles.description}>{overview.Description}</Text>
          </View>
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
};

const DataRow = memo(
  ({ label, value, icon }: { label: string; value: string; icon?: string }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    return (
      <View style={styles.dataRow}>
        <View style={styles.labelContainer}>
          {icon && (
            <Icon
              name={icon}
              size={16}
              color={theme.subtext}
              style={styles.icon}
            />
          )}
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  },
);

const SectionHeader = memo(
  ({ title, icon }: { title: string; icon: string }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    return (
      <View style={styles.sectionHeader}>
        <Icon name={icon} size={20} color={theme.text} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    );
  },
);

const getStyles = (theme: Theme) =>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
      backgroundColor: theme.background,
    },
    headerContent: {
      flex: 1,
    },
    ticker: {
      fontSize: theme.font.size.xxl,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginBottom: 4,
    },
    companyName: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: '400' as any,
      lineHeight: 18,
    },
    bookmarkIcon: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.card,
      marginLeft: 12,
    },
    chartLoadingContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 12,
      borderRadius: 12,
    },
    quickStatsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
    },
    quickStat: {
      flex: 1,
      alignItems: 'center',
    },
    quickStatLabel: {
      fontSize: theme.font.size.xs,
      color: theme.subtext,
      marginBottom: 4,
      textAlign: 'center',
    },
    quickStatValue: {
      fontSize: theme.font.size.sm,
      fontWeight: 'bold' as any,
      color: theme.text,
      textAlign: 'center',
    },
    section: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 8,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 12,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sectionTitle: {
      fontSize: theme.font.size.lg,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginLeft: 8,
    },
    dataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      marginRight: 8,
    },
    label: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: '400' as any,
    },
    value: {
      fontSize: theme.font.size.md,
      color: theme.text,
      fontWeight: 'bold' as any,
      textAlign: 'right',
      flex: 1,
    },
    priceRangeContainer: {
      marginTop: 8,
    },
    description: {
      fontSize: theme.font.size.sm,
      lineHeight: 20,
      color: theme.subtext,
      marginTop: 8,
    },
    priceRangeVisualContainer: {
      marginTop: 8,
    },
    priceLabelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    priceLabelText: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      fontWeight: '600' as any,
    },
    priceBarContainer: {
      height: 6,
      backgroundColor: theme.border,
      borderRadius: 3,
      marginVertical: 8,
      position: 'relative',
    },
    priceBar: {
      height: '100%',
      backgroundColor: theme.primary || '#007AFF',
      borderRadius: 3,
    },
    currentPriceIndicator: {
      position: 'absolute',
      top: -4,
      width: 14,
      height: 14,
      backgroundColor: theme.primary || '#007AFF',
      borderRadius: 7,
      borderWidth: 2,
      borderColor: theme.background,
    },
    currentPriceLabel: {
      alignItems: 'center',
      marginTop: 12,
    },
    currentPriceLabelText: {
      fontSize: theme.font.size.sm,
      color: theme.text,
      fontWeight: 'bold' as any,
    },
  });

export default ProductScreen;