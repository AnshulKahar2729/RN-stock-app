import React, { memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

const ProductErrorScreen = memo(() => {
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading stock data</Text>
      </View>
    </SafeAreaView>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
    },
  });

ProductErrorScreen.displayName = 'ProductErrorScreen';

export default ProductErrorScreen; 