import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
import CreateWatchlist, {
  CreateWatchlistBottomSheetRef,
} from '../../components/watchlist/CreateWatchlist';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { WatchListList } from '../../components/watchlist/WatchListList';
import { Theme } from '../../utils';

const WatchlistHomeScreen = () => {
  const { addWatchlist } = useWatchlist();
  const createWatchlistRef = useRef<CreateWatchlistBottomSheetRef>(null);
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  const showCreateForm = () => {
    createWatchlistRef.current?.show();
  };

  const handleCreateWatchlist = (name: string) => {
    addWatchlist(name);
  };

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
          <Header showCreateForm={showCreateForm} />
          <WatchListList showCreateForm={showCreateForm} />
          <CreateWatchlist
            ref={createWatchlistRef}
            onCreateWatchlist={handleCreateWatchlist}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const Header = ({ showCreateForm }: { showCreateForm: () => void }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  return (
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
          <Icon name="add" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 16,
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
    backgroundColor: theme.accent,
    shadowColor: theme.shadow.color,
    shadowOffset: theme.shadow.offset,
    shadowOpacity: theme.shadow.opacity,
    shadowRadius: theme.shadow.radius,
    elevation: theme.shadow.elevation,
  },
});

export default WatchlistHomeScreen;
