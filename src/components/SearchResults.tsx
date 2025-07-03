import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../utils';
import { StockSearch } from '../types/stock';

interface SearchResultsProps {
  results: StockSearch[];
  isLoading: boolean;
  error: Error | null;
  onSelectStock: (stock: StockSearch) => void;
  isVisible: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onSelectStock,
  isVisible,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!isVisible) {
    return null;
  }

  const handleStockPress = (item: StockSearch) => {
    // Call the parent function immediately
    onSelectStock(item);
  };

  const renderSearchItem = (item: StockSearch, index: number) => (
    <TouchableOpacity
      key={`${item.symbol}-${index}`}
      style={[
        styles.resultItem,
        index === results.length - 1 && styles.lastResultItem
      ]}
      onPress={() => handleStockPress(item)}
      activeOpacity={0.7}
      delayPressIn={0}
      delayPressOut={0}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <View style={styles.resultContent}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.region}>{item.region}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={16} color={theme.subtext} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container} pointerEvents="auto">
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={theme.error} />
          <Text style={styles.errorText}>Search failed. Try again.</Text>
        </View>
      )}

      {!isLoading && !error && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <Icon name="search" size={16} color={theme.subtext} />
          <Text style={styles.emptyText}>No stocks found</Text>
        </View>
      )}

      {!isLoading && !error && results.length > 0 && (
        <ScrollView
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          scrollEnabled={true}
        >
          {results.map((item, index) => renderSearchItem(item, index))}
        </ScrollView>
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: theme.card,
      borderRadius: 8,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      shadowColor: theme.shadow.color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
      borderWidth: 1,
      borderColor: theme.border,
      borderTopWidth: 0,
      maxHeight: 300,
      zIndex: 9999,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'center',
    },
    loadingText: {
      marginLeft: 8,
      fontSize: theme.font.size.sm,
      color: theme.subtext,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'center',
    },
    errorText: {
      marginLeft: 8,
      fontSize: theme.font.size.sm,
      color: theme.error,
    },
    emptyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'center',
    },
    emptyText: {
      marginLeft: 8,
      fontSize: theme.font.size.sm,
      color: theme.subtext,
    },
    resultsList: {
      flexGrow: 0,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + '30',
    },
    lastResultItem: {
      borderBottomWidth: 0,
    },
    resultContent: {
      flex: 1,
    },
    symbolContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    symbol: {
      fontSize: theme.font.size.md,
      fontWeight: 'bold',
      color: theme.text,
      marginRight: 8,
    },
    type: {
      fontSize: theme.font.size.xs,
      color: theme.subtext,
      backgroundColor: theme.background,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    name: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      marginBottom: 4,
      lineHeight: 18,
    },
    detailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    region: {
      fontSize: theme.font.size.xs,
      color: theme.subtext,
    },
  }); 