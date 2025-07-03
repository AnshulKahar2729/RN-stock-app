import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface ViewAllEmptyScreenProps {
  type: 'gainers' | 'losers';
}

const ViewAllEmptyScreen = memo<ViewAllEmptyScreenProps>(({ type }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.emptyContainer}>
      <Icon name="trending-up" size={48} color={theme.subtext} />
      <Text style={styles.emptyText}>
        No {type} found at the moment
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

ViewAllEmptyScreen.displayName = 'ViewAllEmptyScreen';

export default ViewAllEmptyScreen; 