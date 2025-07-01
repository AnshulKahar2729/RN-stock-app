import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const EmptyStockGrid = ({
  message,
  error,
  loadStockData,
}: {
  message: string;
  error: string | null;
  loadStockData: () => void;
}) => (
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

const styles = StyleSheet.create({
  emptyGridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 10,
  },
  retryButtonSmall: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonTextSmall: {
    color: '#fff',
    fontSize: 14,
  },
});
