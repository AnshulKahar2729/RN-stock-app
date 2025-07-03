import React, { memo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

const HomeLoadingScreen = memo(() => {
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.loadingContainer}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={styles.loadingText}>Loading stocks...</Text>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
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
  });

HomeLoadingScreen.displayName = 'HomeLoadingScreen';

export default HomeLoadingScreen; 