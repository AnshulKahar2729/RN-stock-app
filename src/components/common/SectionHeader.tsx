import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface SectionHeaderProps {
  title: string;
  icon: string;
}

const SectionHeader = memo<SectionHeaderProps>(({ title, icon }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  return (
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={20} color={theme.text} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sectionTitle: {
      fontSize: theme.font.size.lg,
      fontWeight: 'bold' as any,
      color: theme.text,
      marginLeft: 8,
    },
  });

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader; 