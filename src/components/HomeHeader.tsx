import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import { Searchbar } from './common/Searchbar';
import { useStockSearch } from '../hooks/useStock';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../utils';
import { SearchResults } from './SearchResults';
import { StockSearch } from '../types/stock';
import { useNavigation } from '@react-navigation/native';

export const HomeHeader = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, mode, toggleTheme } = useTheme();
  const styles = getStyles(theme);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300) as any;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Use search hook with debounced query
  const {
    data: searchResults = [],
    isLoading: searchLoading,
    error: searchError,
  } = useStockSearch(debouncedQuery || '');

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowResults(true);
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Only hide results if search is not focused and there's no query
    // This prevents the dropdown from closing when tapping on results
    setTimeout(() => {
      if (!isSearchFocused) {
        setShowResults(false);
      }
    }, 200);
  };

  // Handle search result selection
  const handleSelectStock = (stock: StockSearch) => {
    // Validate stock object
    if (!stock || !stock.symbol || typeof stock.symbol !== 'string' || stock.symbol.trim() === '') {
      console.error('Invalid stock object or symbol:', stock);
      return;
    }
    
    const ticker = stock.symbol.trim();
    
    try {
      // Navigate immediately
      navigation.navigate('Product', { ticker: ticker });
      
      // Clear search state after navigation
      setSearchQuery('');
      setShowResults(false);
      setIsSearchFocused(false);
      Keyboard.dismiss();
      
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    setIsSearchFocused(false);
  };

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.header, borderBottomColor: theme.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.primary }]}>
            Stocks App
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: theme.card }]}>
            <Icon
              name="search"
              size={18}
              color={theme.subtext}
              style={styles.searchIcon}
            />
            <Searchbar
              searchQuery={searchQuery}
              setSearchQuery={handleSearchChange}
              placeholder="Search stocks..."
              placeholderTextColor={theme.subtext}
              style={[styles.searchInput, { color: theme.text }]}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onSubmitEditing={() => {
                if (searchQuery.trim()) {
                  try {
                    navigation.navigate('Product', { ticker: searchQuery.trim().toUpperCase() });
                    setSearchQuery('');
                    setShowResults(false);
                    setIsSearchFocused(false);
                  } catch (error) {
                    console.error('Direct search navigation failed:', error);
                  }
                }
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearButton}
              >
                <Icon name="close-circle" size={18} color={theme.subtext} />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Results */}
          <SearchResults
            results={searchResults}
            isLoading={searchLoading}
            error={searchError}
            onSelectStock={handleSelectStock}
            isVisible={
              showResults && (debouncedQuery.length > 0 || searchLoading)
            }
          />
        </View>

        {/* Theme Toggle Button */}
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Icon
            name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 10 : 24,
      paddingBottom: 6,
      backgroundColor: theme.header,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      zIndex: 999,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flex: 1,
    },
    title: {
      fontSize: theme.font.size.lg,
      fontWeight: 'bold' as any,
      color: theme.primary,
    },
    subtitle: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      position: 'relative',
      zIndex: 1001,
      overflow: 'visible',
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      width: '100%',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: theme.font.size.md,
      padding: 0,
      color: theme.text,
    },
    clearButton: {
      marginLeft: 8,
      padding: 2,
    },
    loadingText: {
      marginTop: 4,
      fontSize: theme.font.size.xs,
      color: theme.subtext,
    },
    themeToggle: {
      marginLeft: 12,
    },
  });