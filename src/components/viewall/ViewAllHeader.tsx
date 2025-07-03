import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface ViewAllHeaderProps {
  title: string;
  onBackPress: () => void;
}

const ViewAllHeader = memo<ViewAllHeaderProps>(({ title, onBackPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleBackPress = useCallback(() => {
    onBackPress();
  }, [onBackPress]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={20} color={theme.text} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingTop: 12,
      paddingBottom: 8,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.header,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    title: {
      fontSize: theme.font.size.lg,
      fontWeight: theme.font.weight.bold as any,
      color: theme.text,
      flex: 1,
    },
  });

ViewAllHeader.displayName = 'ViewAllHeader';

export default ViewAllHeader; 