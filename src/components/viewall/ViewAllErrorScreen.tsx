import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface ViewAllErrorScreenProps {
  type: 'gainers' | 'losers';
}

const ViewAllErrorScreen = memo<ViewAllErrorScreenProps>(({ type }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.emptyContainer}>
      <Icon name="error-outline" size={48} color={theme.subtext} />
      <Text style={styles.emptyText}>
        Failed to load {type}. Please try again later.
      </Text>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      textAlign: 'center',
      marginTop: 16,
      fontWeight: theme.font.weight.medium as any,
    },
  });

ViewAllErrorScreen.displayName = 'ViewAllErrorScreen';

export default ViewAllErrorScreen; 