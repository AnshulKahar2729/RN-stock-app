import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface WatchlistHeaderProps {
  onCreatePress: () => void;
}

const WatchlistHeader = memo<WatchlistHeaderProps>(({ onCreatePress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleCreatePress = useCallback(() => {
    onCreatePress();
  }, [onCreatePress]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Watchlists
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton]}
          onPress={handleCreatePress}
          activeOpacity={0.8}
        >
          <Icon name="add" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const getStyles = (theme: Theme) => StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 10 : 24,
    paddingBottom: 8,
    paddingHorizontal: 20,
    backgroundColor: theme.header,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.font.size.lg,
    fontWeight: "bold" as any,
    color: theme.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.primary,
    shadowColor: theme.shadow.color,
    shadowOffset: theme.shadow.offset,
    shadowOpacity: theme.shadow.opacity,
    shadowRadius: theme.shadow.radius,
    elevation: theme.shadow.elevation,
  },
});

WatchlistHeader.displayName = 'WatchlistHeader';

export default WatchlistHeader; 