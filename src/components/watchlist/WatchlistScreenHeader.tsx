import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface WatchlistScreenHeaderProps {
  title: string;
  stockCount: number;
}

const WatchlistScreenHeader = memo<WatchlistScreenHeaderProps>(({ title, stockCount }) => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.header, borderBottomColor: theme.border },
      ]}
    >
      <View style={styles.headerLeft}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ padding: 4 }} // Increase touch target
        >
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={[styles.stockCount, { color: theme.subtext }]}>
          {stockCount} {stockCount === 1 ? 'stock' : 'stocks'}
        </Text>
      </View>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.header,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      shadowColor: theme.shadow.color,
      shadowOffset: theme.shadow.offset,
      shadowOpacity: theme.shadow.opacity,
      shadowRadius: theme.shadow.radius,
      elevation: theme.shadow.elevation,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerTitle: {
      fontSize: theme.font.size.xl,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginLeft: 12,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    stockCount: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      fontWeight: '400' as any,
    },
  });

WatchlistScreenHeader.displayName = 'WatchlistScreenHeader';

export default WatchlistScreenHeader; 