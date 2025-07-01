import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { fetchTopGainers, fetchTopLosers } from '../../services/api';
import TopStockCard from '../../components/TopStockCard';
import { TopStock } from '../../types/stock';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Theme } from '../../utils';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PAGE_SIZE = 10;

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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      ...theme.shadow,
      shadowColor: theme.shadow.color,
      shadowOffset: theme.shadow.offset,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      elevation: theme.shadow.elevation,
    },
    title: {
      fontSize: theme.font.size.xl,
      fontWeight: theme.font.weight.bold as any,
      color: theme.text,
      flex: 1,
    },
    listContainer: {
      flex: 1,
    },
    itemWrapper: {
      flex: 1,
      paddingHorizontal: 4,
      paddingVertical: 6,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: theme.font.weight.medium as any,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: theme.font.weight.medium as any,
      textAlign: 'center',
    },
    // Compact Modern Pagination Styles
    paginationContainer: {
      backgroundColor: theme.card,
      marginHorizontal: 8,
      marginTop: 12,
      marginBottom: 16,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow.color,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    paginationContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paginationInfo: {
      flex: 1,
    },
    paginationStats: {
      fontSize: theme.font.size.xs,
      color: theme.subtext,
      fontWeight: theme.font.weight.medium as any,
    },
    paginationProgress: {
      fontSize: theme.font.size.xs,
      color: theme.primary,
      fontWeight: theme.font.weight.bold as any,
      marginTop: 2,
    },
    paginationControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    paginationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      minWidth: 80,
      justifyContent: 'center',
      opacity: 1,
    },
    paginationButtonDisabled: {
      backgroundColor: theme.border,
      opacity: 0.5,
    },
    paginationButtonText: {
      color: theme.card,
      fontSize: theme.font.size.xs,
      fontWeight: theme.font.weight.bold as any,
      marginHorizontal: 4,
    },
    paginationButtonTextDisabled: {
      color: theme.subtext,
    },
    pageIndicator: {
      backgroundColor: theme.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      minWidth: 60,
      alignItems: 'center',
    },
    pageIndicatorText: {
      fontSize: theme.font.size.xs,
      fontWeight: theme.font.weight.bold as any,
      color: theme.primary,
    },
    quickJumpContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      justifyContent: 'center',
      gap: 4,
    },
    quickJumpButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      minWidth: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    quickJumpButtonActive: {
      backgroundColor: theme.primary,
    },
    quickJumpButtonText: {
      fontSize: theme.font.size.xs,
      color: theme.subtext,
      fontWeight: theme.font.weight.medium as any,
    },
    quickJumpButtonTextActive: {
      color: theme.card,
      fontWeight: theme.font.weight.bold as any,
    },
    quickJumpDots: {
      paddingHorizontal: 4,
    },
    progressBarContainer: {
      height: 2,
      backgroundColor: theme.border,
      borderRadius: 1,
      marginTop: 8,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 1,
    },
  });

const ViewAllScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<{ params: { type: 'gainers' | 'losers' } }, 'params'>>();
  const [stocks, setStocks] = useState<TopStock[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    setLoading(true);
    const fetch =
      route.params.type === 'gainers' ? fetchTopGainers : fetchTopLosers;
    fetch().then(data => {
      setStocks(data);
      setLoading(false);
    });
  }, [route.params.type]);

  // Pagination
  const paginatedStocks = stocks.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const totalPages = Math.ceil(stocks.length / PAGE_SIZE);
  const startItem = (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, stocks.length);

  useEffect(() => {
    const progress = totalPages > 0 ? page / totalPages : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [page, totalPages, progressAnim]);

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading stocks...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Icon name="trending-up" size={48} color={theme.subtext} />
        <Text style={styles.emptyText}>
          No {route.params.type} found at the moment
        </Text>
      </View>
    );
  };

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const getQuickJumpPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (page > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (page < totalPages - 2) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <>
        <View style={styles.paginationContainer}>
          <View style={styles.paginationContent}>
            {/* Left: Info */}
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationStats}>
                {startItem}-{endItem} of {stocks.length}
              </Text>
              <Text style={styles.paginationProgress}>
                Page {page} of {totalPages}
              </Text>
            </View>

            {/* Center: Page indicator */}
            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>
                {page}/{totalPages}
              </Text>
            </View>

            {/* Right: Controls */}
            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  !canGoPrevious && styles.paginationButtonDisabled,
                ]}
                onPress={() => setPage(page - 1)}
                disabled={!canGoPrevious}
                activeOpacity={0.7}
              >
                <Icon 
                  name="chevron-left" 
                  size={16} 
                  color={!canGoPrevious ? theme.subtext : theme.card} 
                />
                <Text
                  style={[
                    styles.paginationButtonText,
                    !canGoPrevious && styles.paginationButtonTextDisabled,
                  ]}
                >
                  Prev
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  !canGoNext && styles.paginationButtonDisabled,
                ]}
                onPress={() => setPage(page + 1)}
                disabled={!canGoNext}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    !canGoNext && styles.paginationButtonTextDisabled,
                  ]}
                >
                  Next
                </Text>
                <Icon 
                  name="chevron-right" 
                  size={16} 
                  color={!canGoNext ? theme.subtext : theme.card} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Jump Pages (only show if more than 3 pages) */}
          {totalPages > 3 && (
            <View style={styles.quickJumpContainer}>
              {getQuickJumpPages().map((pageNum, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickJumpButton,
                    pageNum === page && styles.quickJumpButtonActive,
                  ]}
                  onPress={() => typeof pageNum === 'number' && setPage(pageNum)}
                  disabled={pageNum === '...'}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.quickJumpButtonText,
                      pageNum === page && styles.quickJumpButtonTextActive,
                      pageNum === '...' && styles.quickJumpDots,
                    ]}
                  >
                    {pageNum}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {route.params.type === 'gainers' ? 'Top Gainers' : 'Top Losers'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={paginatedStocks}
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <TopStockCard stock={item} />
              </View>
            )}
            keyExtractor={item => item.ticker}
            ListEmptyComponent={renderEmptyComponent}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
        
        {renderPaginationControls()}
      </View>
    </View>
  );
};

export default ViewAllScreen;