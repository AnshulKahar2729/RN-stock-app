import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useWatchlist } from '../../context/WatchlistContext';
import CreateWatchlist, {
  CreateWatchlistBottomSheetRef,
} from '../../components/watchlist/CreateWatchlist';
import { useTheme } from '../../context/ThemeContext';
import { WatchListList } from '../../components/watchlist/WatchListList';
import WatchlistHeader from '../../components/watchlist/WatchlistHeader';

const WatchlistHomeScreen = () => {
  const { addWatchlist } = useWatchlist();
  const createWatchlistRef = useRef<CreateWatchlistBottomSheetRef>(null);
  const { theme, mode } = useTheme();
  const styles = getStyles(theme);

  const showCreateForm = useCallback(() => {
    createWatchlistRef.current?.show();
  }, []);

  const handleCreateWatchlist = useCallback((name: string) => {
    addWatchlist(name);
  }, [addWatchlist]);

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
          <WatchlistHeader onCreatePress={showCreateForm} />
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

const getStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});

export default WatchlistHomeScreen;
