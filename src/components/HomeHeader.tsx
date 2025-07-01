import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Searchbar } from './common/Searchbar';
// import { useStockSearch } from '../hooks/useStock';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export const HomeHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.border }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.primary }]}>Stocks App</Text>
        </View>
        {/* Theme Toggle Button */}
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 12 }}>
          <Icon
            name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color={theme.primary}
          />
        </TouchableOpacity>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBox, { backgroundColor: mode === 'dark' ? '#23232A' : '#f8f8f8' }]}>
            <Icon
              name="search"
              size={18}
              color={theme.subtext}
              style={styles.searchIcon}
            />
            <Searchbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search..."
              placeholderTextColor={theme.subtext}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 6,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
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
    fontSize: 16,
    padding: 0,
  },
  loadingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },
});
