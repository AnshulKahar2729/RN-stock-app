import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../utils';

export const EmptyStockGrid = ({
  message,
  error,
  loadStockData,
}: {
  message: string;
  error: string | null;
  loadStockData: () => void;
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (  
  <View style={styles.emptyGridContainer}>
    <View style={styles.emptyCard}>
      <Text style={styles.emptyMessage}>{message}</Text>
      {error && (
        <TouchableOpacity
          onPress={() => loadStockData()}
          style={styles.retryButtonSmall}
        >
          <Text style={styles.retryButtonTextSmall}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  emptyGridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: theme.shadow.color,
    shadowOffset: theme.shadow.offset,
    shadowOpacity: theme.shadow.opacity,
    shadowRadius: theme.shadow.radius,
    elevation: theme.shadow.elevation,
  },
  emptyMessage: {
    fontSize: theme.font.size.md,
    color: theme.subtext,
    marginTop: 10,
    fontWeight: "400" as any,
  },
  retryButtonSmall: {
    backgroundColor: theme.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonTextSmall: {
    color: theme.card,
    fontSize: theme.font.size.sm,
    fontWeight: "bold" as any,
  },
});
