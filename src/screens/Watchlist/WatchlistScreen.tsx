import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Watchlist } from '../../types/stock';
import { useWatchlist } from '../../context/WatchlistContext';
import StockCard from '../../components/TopStockCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';
import { useStockOverview } from '../../hooks/useStock';

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      minHeight: Dimensions.get('window').height,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    header: {
      backgroundColor: theme.header,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      shadowColor: theme.shadow.color,
      shadowOffset: theme.shadow.offset,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      elevation: theme.shadow.elevation,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerTitle: {
      fontSize: theme.font.size.xl,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginLeft: 12,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    stockCount: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      fontWeight: '400' as any,
    },
    quickActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    addStockButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary + '10',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    addStockText: {
      fontSize: theme.font.size.md,
      fontWeight: 'bold' as any,
      color: theme.primary,
      marginLeft: 8,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.header,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sortText: {
      fontSize: theme.font.size.md,
      fontWeight: '400' as any,
      color: theme.subtext,
      marginLeft: 6,
    },
    stockList: {
      flex: 1,
    },
    stockListContent: {
      paddingBottom: 20,
    },
    // Updated: Proper wrapper for individual stock cards
    stockCardWrapper: {
      flex: 0.5,
      paddingHorizontal: 6,
      paddingVertical: 6,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingTop: 80,
    },
    emptyIconContainer: {
      width: 96,
      height: 96,
      backgroundColor: theme.card,
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: theme.font.size.xxl,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    addFirstStockButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    addFirstStockText: {
      fontSize: theme.font.size.md,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginLeft: 8,
    },
    notFoundContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    notFoundTitle: {
      fontSize: theme.font.size.xxl,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginTop: 24,
      marginBottom: 8,
    },
    notFoundSubtitle: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      textAlign: 'center',
    },
  });

export default function WatchlistScreen() {
  const { watchlists } = useWatchlist();
  const route =
    useRoute<RouteProp<{ params: { title: string; id: string } }, 'params'>>();
  const { title, id } = route.params;
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const selectedWatchlist = watchlists.find(w => w.id === id);
    if (selectedWatchlist) {
      setWatchlist(selectedWatchlist);
    }
  }, [id, watchlists]);

  console.log('selected watchlist', watchlist);

  const renderStockList = () => (
    <WatchlistStockList tickers={watchlist?.tickers || []} />
  );

  if (!watchlist) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <View style={styles.notFoundContainer}>
          <Icon name="error-outline" size={64} color={theme.error} />
          <Text style={[styles.notFoundTitle, { color: theme.text }]}>
            Watchlist Not Found
          </Text>
          <Text style={[styles.notFoundSubtitle, { color: theme.subtext }]}>
            The watchlist you're looking for doesn't exist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Header title={title} stockCount={watchlist.tickers?.length || 0} />
      <View style={styles.content}>
        {/* Stock List */}
        <View style={styles.stockList}>{renderStockList()}</View>
      </View>
    </SafeAreaView>
  );
}

function Header({ title, stockCount }: { title: string; stockCount: number }) {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.header, borderBottomColor: theme.border },
      ]}
    >
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 4 }} // Increase touch target
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={[styles.stockCount, { color: theme.subtext }]}>
          {stockCount} {stockCount === 1 ? 'stock' : 'stocks'}
        </Text>
      </View>
    </View>
  );
}

function WatchlistStockList({ tickers }: { tickers: string[] }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <FlatList
      data={tickers}
      renderItem={({ item }) => (
        <View style={styles.stockCardWrapper}>
          <WatchlistStockCard ticker={item} />
        </View>
      )}
      keyExtractor={item => item}
      numColumns={2}
      contentContainerStyle={styles.stockListContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <View
            style={[styles.emptyIconContainer, { backgroundColor: theme.card }]}
          >
            <Icon name="trending-up" size={48} color={theme.subtext} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No stocks yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
            Add stocks to your watchlist to track their performance
          </Text>
        </View>
      )}
    />
  );
}

function WatchlistStockCard({ ticker }: { ticker: string }) {
  const { data: overview, isLoading: isOverviewLoading } =
    useStockOverview(ticker);
  const { data: timeSeriesData, isLoading: isTimeSeriesLoading } =
    require('../../hooks/useStock').useTimeSeries(ticker, '1M');

  if (isOverviewLoading || isTimeSeriesLoading || !overview || !timeSeriesData)
    return null;

  // Get current price logic (same as before)
  const getCurrentPrice = () => {
    if (!overview) return '';
    const priceFields = [
      overview['50DayMovingAverage'],
      overview['200DayMovingAverage'],
      overview['52WeekHigh'],
      overview['BookValue'],
    ];
    for (const field of priceFields) {
      if (field && !isNaN(Number(field)) && Number(field) > 0) {
        return String(field);
      }
    }
    return '';
  };

  // Calculate change_amount and change_percentage from time series data (1M)
  const safeParseFloat = (
    value: string | number | null | undefined,
  ): number => {
    if (value === null || value === undefined || value === '') return 0;
    const str = String(value).trim();
    if (
      str === 'N/A' ||
      str === 'NaN' ||
      str === 'None' ||
      str === '--' ||
      str === 'null' ||
      str === 'undefined'
    ) {
      return 0;
    }
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  };

  type TimeSeriesValue = {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };

  // Extract and sort close prices by date ascending
  const entries = Object.entries(timeSeriesData.timeSeries || {})
    .map(([date, values]) => {
      const v = values as TimeSeriesValue;
      const close = safeParseFloat(v['4. close']);
      const timestamp = new Date(date).getTime();
      if (close > 0 && !isNaN(timestamp)) {
        return { date, close, timestamp };
      }
      return null;
    })
    .filter(
      (entry): entry is { date: string; close: number; timestamp: number } =>
        entry !== null,
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  let change_amount = '';
  let change_percentage = '';
  if (entries.length > 1) {
    const currentPrice = entries[entries.length - 1].close;
    const previousPrice = entries[0].close;
    const change = currentPrice - previousPrice;
    const percent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;
    change_amount = change.toFixed(2);
    change_percentage = percent.toFixed(2);
  }

  const stock = {
    ticker,
    price: getCurrentPrice(),
    change_amount,
    change_percentage,
    volume: '', // Could be enhanced with time series
  };
  return <StockCard stock={stock} />;
}