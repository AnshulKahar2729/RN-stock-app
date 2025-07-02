import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Searchbar } from './common/Searchbar';
// import { useStockSearch } from '../hooks/useStock';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../utils';

export const HomeHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, mode, toggleTheme } = useTheme();
  const styles = getStyles(theme);
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
              setSearchQuery={setSearchQuery}
              placeholder="Search..."
              placeholderTextColor={theme.subtext}
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>
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
      paddingTop: Platform.OS === 'ios' ? 10 : 10,
      paddingBottom: 6,
      backgroundColor: theme.header,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
    loadingText: {
      marginTop: 4,
      fontSize: theme.font.size.xs,
      color: theme.subtext,
    },
    themeToggle: {
      marginLeft: 12,
    },
  });
