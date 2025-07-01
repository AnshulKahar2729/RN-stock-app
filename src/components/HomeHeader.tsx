import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Searchbar } from './common/Searchbar';
// import { useStockSearch } from '../hooks/useStock';
import Icon from 'react-native-vector-icons/Ionicons';

export const HomeHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // const { isLoading } = useStockSearch(searchQuery);

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Stocks App</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Icon
              name="search"
              size={18}
              color="#8E8E93"
              style={styles.searchIcon}
            />
            <Searchbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search..."
              placeholderTextColor="#8E8E93"
              style={styles.searchInput}
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
    paddingTop: 20,
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
