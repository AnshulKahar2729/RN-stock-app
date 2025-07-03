import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

const NotFoundWatchlist = memo(() => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.notFoundContainer}>
      <Icon name="error-outline" size={64} color={theme.error} />
      <Text style={[styles.notFoundTitle, { color: theme.text }]}>
        Watchlist Not Found
      </Text>
      <Text style={[styles.notFoundSubtitle, { color: theme.subtext }]}>
        The watchlist you're looking for doesn't exist
      </Text>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
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

NotFoundWatchlist.displayName = 'NotFoundWatchlist';

export default NotFoundWatchlist; 