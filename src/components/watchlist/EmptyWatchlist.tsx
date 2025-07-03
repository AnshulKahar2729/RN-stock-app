import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

const EmptyWatchlist = memo(() => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
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
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
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
  });

EmptyWatchlist.displayName = 'EmptyWatchlist';

export default EmptyWatchlist; 