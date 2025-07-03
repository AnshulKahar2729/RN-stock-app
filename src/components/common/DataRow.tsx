import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface DataRowProps {
  label: string;
  value: string;
  icon?: string;
}

const DataRow = memo<DataRowProps>(({ label, value, icon }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  return (
    <View style={styles.dataRow}>
      <View style={styles.labelContainer}>
        {icon && (
          <Icon
            name={icon}
            size={16}
            color={theme.subtext}
            style={styles.icon}
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    dataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    labelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      marginRight: 8,
    },
    label: {
      fontSize: theme.font.size.md,
      color: theme.subtext,
      fontWeight: '400' as any,
    },
    value: {
      fontSize: theme.font.size.md,
      color: theme.text,
      fontWeight: 'bold' as any,
      textAlign: 'right',
      flex: 1,
    },
  });

DataRow.displayName = 'DataRow';

export default DataRow; 