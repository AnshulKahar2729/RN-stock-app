import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
import { Watchlist } from '../../types/stock';
import CreateWatchlist, {
  CreateWatchlistBottomSheetRef,
} from '../../components/watchlist/CreateWatchlist';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const WatchlistHomeScreen = () => {
  const { watchlists, addWatchlist } = useWatchlist();
  const navigation = useNavigation<any>();
  const createWatchlistRef = useRef<CreateWatchlistBottomSheetRef>(null);
  const { theme, mode } = useTheme();

  const showCreateForm = () => {
    createWatchlistRef.current?.show();
  };

  const handleCreateWatchlist = (name: string) => {
    addWatchlist(name);
  };

  const handleWatchlistPress = (watchlist: Watchlist) => {
    navigation.navigate('WatchlistDetail', {
      title: watchlist.name,
      id: watchlist.id,
    });
  };

  const renderWatchlist = ({ item }: { item: Watchlist }) => (
    <TouchableOpacity
      style={[
        styles.watchlistCard,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onPress={() => handleWatchlistPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.accent + '15' },
          ]}
        >
          <Icon name="list-outline" size={20} color={theme.accent} />
        </View>
        <View style={styles.watchlistInfo}>
          <Text style={[styles.watchlistName, { color: theme.text }]}>
            {item.name}
          </Text>
          <View style={styles.stockCountContainer}>
            <Icon name="trending-up-outline" size={14} color={theme.subtext} />
            <Text style={[styles.stockCount, { color: theme.subtext }]}>
              {item.stocks.length}{' '}
              {item.stocks.length === 1 ? 'stock' : 'stocks'}
            </Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color={theme.subtext} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
        translucent={false}
      />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
      >
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>
                  Watchlists
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.accent }]}
                onPress={showCreateForm}
                activeOpacity={0.8}
              >
                <Icon name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          {watchlists.length === 0 ? (
            <EmptyState showCreateForm={showCreateForm} />
          ) : (
            <FlatList
              data={watchlists}
              renderItem={renderWatchlist}
              keyExtractor={(item: Watchlist) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}

          <CreateWatchlist
            ref={createWatchlistRef}
            onCreateWatchlist={handleCreateWatchlist}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const EmptyState = ({ showCreateForm }: { showCreateForm: () => void }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: theme.accent + '10' },
        ]}
      >
        <Icon name="eye-outline" size={48} color={theme.accent} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No watchlists yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.subtext }]}>
        Create your first watchlist to track your favorite stocks and monitor
        their performance
      </Text>
      <TouchableOpacity
        style={[styles.primaryButton, { backgroundColor: theme.accent }]}
        onPress={showCreateForm}
        activeOpacity={0.8}
      >
        <Icon name="add" size={18} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>Create Watchlist</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  /* 
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  */
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 2,
    fontWeight: '400',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  watchlistCard: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  watchlistInfo: {
    flex: 1,
  },
  watchlistName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  stockCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockCount: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WatchlistHomeScreen;
