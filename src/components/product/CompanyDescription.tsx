import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';
import SectionHeader from '../common/SectionHeader';

interface CompanyDescriptionProps {
  description: string;
}

const CompanyDescription = memo<CompanyDescriptionProps>(({ description }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.section}>
      <SectionHeader title="About" icon="document-text-outline" />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 8,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 12,
    },
    description: {
      fontSize: theme.font.size.sm,
      lineHeight: 20,
      color: theme.subtext,
      marginTop: 8,
    },
  });

CompanyDescription.displayName = 'CompanyDescription';

export default CompanyDescription; 