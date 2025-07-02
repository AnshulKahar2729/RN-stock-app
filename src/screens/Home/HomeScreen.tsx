import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useGetTopGainersLosers } from '../../hooks/useStock'; // Updated import
import TopStockCard from '../../components/TopStockCard';
import { EmptyStockGrid } from '../../components/EmptyStockGrid';
import { HomeHeader } from '../../components/HomeHeader';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 12,
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: '400' as any,
    },
    section: {
      paddingHorizontal: 10,
      paddingTop: 12,
      paddingBottom: 12,
      backgroundColor: theme.background,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: theme.font.size.lg,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginBottom: 2,
    },
    sectionSubtitle: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      fontWeight: '400' as any,
    },
    viewAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.primary + '15',
    },
    viewAllText: {
      color: theme.primary,
      fontSize: theme.font.size.sm,
      fontWeight: 'bold' as any,
    },
    listContainer: {
      gap: 12,
    },
    cardContainer: {
      flex: 1,
      marginHorizontal: 6,
    },
    emptyGridContainer: {
      height: 264,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    },
    emptyCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      shadowColor: theme.shadow.color,
      shadowOffset: theme.shadow.offset,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      elevation: theme.shadow.elevation,
      borderWidth: 1,
      borderColor: theme.border,
      width: '80%',
      maxWidth: 280,
    },
    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    emptyIconText: {
      fontSize: theme.font.size.xl,
    },
    emptyMessage: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      textAlign: 'center',
      fontWeight: '400' as any,
      marginBottom: 12,
    },
    retryButtonSmall: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 8,
    },
    retryButtonTextSmall: {
      color: theme.card,
      fontSize: theme.font.size.sm,
      fontWeight: 'bold' as any,
    },
  });

const HomeScreen = ({ navigation }: any) => {
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

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

  // Memoize sliced data to prevent unnecessary re-renders
  const displayedGainers = useMemo(() => gainers.slice(0, 4), [gainers]);
  const displayedLosers = useMemo(() => losers.slice(0, 4), [losers]);

  // Memoized navigation handlers
  const navigateToViewAll = useCallback(
    (type: 'gainers' | 'losers') => {
      navigation?.navigate?.('ViewAll', { type });
    },
    [navigation],
  );

  // Handle refresh - refetch both queries
  const onRefresh = useCallback(async () => {
    await Promise.all([refetchGainers(), refetchLosers()]);
  }, [refetchGainers, refetchLosers]);

  // Handle retry for errors
  const handleRetry = useCallback(() => {
    if (gainersError) refetchGainers();
    if (losersError) refetchLosers();
  }, [gainersError, losersError, refetchGainers, refetchLosers]);

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 120,
      offset: 120 * index,
      index,
    }),
    [],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText]}>Loading stocks...</Text>
      </View>
    );
  }

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
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <HomeHeader />

        {/* Top Gainers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Top Gainers
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToViewAll('gainers')}
              style={[
                styles.viewAllButton,
                { backgroundColor: theme.primary + '15' },
              ]}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {displayedGainers.length > 0 ? (
            <FlatList
              data={displayedGainers}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <TopStockCard stock={item} />
                </View>
              )}
              keyExtractor={item => `gainer-${item.ticker}`}
              scrollEnabled={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              initialNumToRender={4}
              getItemLayout={getItemLayout}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <EmptyStockGrid
              message={
                gainersError
                  ? 'Failed to load gainers data'
                  : 'No gainers data available'
              }
              error={gainersError?.message || null}
              loadStockData={handleRetry}
            />
          )}
        </View>

        {/* Top Losers Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Top Losers
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigateToViewAll('losers')}
              style={[
                styles.viewAllButton,
                { backgroundColor: theme.primary + '15' },
              ]}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {displayedLosers.length > 0 ? (
            <FlatList
              data={displayedLosers}
              numColumns={2}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <TopStockCard stock={item} />
                </View>
              )}
              keyExtractor={item => `loser-${item.ticker}`}
              scrollEnabled={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              initialNumToRender={4}
              getItemLayout={getItemLayout}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <EmptyStockGrid
              message={
                losersError
                  ? 'Failed to load losers data'
                  : 'No losers data available'
              }
              error={losersError?.message || null}
              loadStockData={handleRetry}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
