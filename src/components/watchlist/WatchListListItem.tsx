import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Watchlist } from '../../types/stock';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const getStyles = (theme: any) => StyleSheet.create({
  watchlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 0.5,
    borderColor: theme.border,
    backgroundColor: theme.background,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.accent + '15',
  },
  watchlistInfo: {
    flex: 1,
    marginLeft: 12,
  },
  watchlistName: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.bold,
    color: theme.text,
  },
  stockCountContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  stockCount: {
    fontSize: theme.font.size.sm,
    color: theme.subtext,
  },
});

export const WatchListListItem = ({ item }: { item: Watchlist }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const styles = getStyles(theme);
  const handleWatchlistPress = (watchlist: Watchlist) => {
    navigation.navigate('WatchlistDetail', {
      title: watchlist.name,
      id: watchlist.id,
    });
  };
  return (
    <TouchableOpacity
      style={styles.watchlistCard}
      onPress={() => handleWatchlistPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View
          style={styles.iconContainer}
        >
          <Icon name="list-outline" size={20} color={theme.accent} />
        </View>
        <View style={styles.watchlistInfo}>
          <Text style={styles.watchlistName}>
            {item.name}
          </Text>
          <View style={styles.stockCountContainer}>
            <Icon name="trending-up-outline" size={12} color={theme.subtext} />
            <Text style={styles.stockCount}>
              {item.stocks.length}{' '}
              {item.stocks.length === 1 ? 'stock' : 'stocks'}
            </Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color={theme.subtext} />
      </View>
    </TouchableOpacity>
  );
};
