import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

const ViewAllLoadingScreen = memo(() => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.loadingContainer}>
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
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: theme.font.weight.medium as any,
    },
  });

ViewAllLoadingScreen.displayName = 'ViewAllLoadingScreen';

export default ViewAllLoadingScreen; 