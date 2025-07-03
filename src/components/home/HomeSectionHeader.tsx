import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface HomeSectionHeaderProps {
  title: string;
  subtitle?: string;
  onViewAllPress: () => void;
}

const HomeSectionHeader = memo<HomeSectionHeaderProps>(({
  title,
  subtitle,
  onViewAllPress,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleViewAllPress = useCallback(() => {
    onViewAllPress();
  }, [onViewAllPress]);

  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={handleViewAllPress}
        style={[
          styles.viewAllButton,
          { backgroundColor: theme.primary + '15' },
        ]}
      >
        <Text style={[styles.viewAllText, { color: theme.primary }]}>
          View All
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: theme.font.size.lg,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginBottom: 2,
    },
    sectionSubtitle: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      fontWeight: '400' as any,
    },
    viewAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.primary + '15',
    },
    viewAllText: {
      color: theme.primary,
      fontSize: theme.font.size.sm,
      fontWeight: 'bold' as any,
    },
  });

HomeSectionHeader.displayName = 'HomeSectionHeader';

export default HomeSectionHeader; 