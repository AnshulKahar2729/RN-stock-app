import React, {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-gesture-handler';

import { useWatchlist } from '../context/WatchlistContext';
import { TopStock } from '../types/stock';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../utils';

interface AddToWatchlistSheetProps {
  stock: TopStock;
  onClose: () => void;
}

export interface AddToWatchlistSheetRef {
  show: () => void;
  hide: () => void;
}

const AddToWatchlistSheet = forwardRef<
  AddToWatchlistSheetRef,
  AddToWatchlistSheetProps
>(({ stock, onClose }, ref) => {
  const { watchlists, addWatchlist, addStockToWatchlist } = useWatchlist();
  const [newListName, setNewListName] = useState('');
  const { theme } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['50%', '65%'], []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setNewListName('');
        onClose();
      }
    },
    [onClose],
  );

  const show = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleCreateAndAdd = useCallback(() => {
    if (newListName.trim()) {
      const newWatchlistId = addWatchlist(newListName.trim());
      addStockToWatchlist(newWatchlistId, stock);
      setNewListName('');
      hide();
    } else {
      Alert.alert('Error', 'Please enter a watchlist name');
    }
  }, [newListName, addWatchlist, addStockToWatchlist, stock, hide]);

  const handleAddToExisting = useCallback(
    (watchlistId: string) => {
      addStockToWatchlist(watchlistId, stock);
      hide();
    },
    [addStockToWatchlist, stock, hide],
  );

  const renderWatchlistItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        style={getStyles(theme).watchlistItem}
        onPress={() => handleAddToExisting(item.id)}
      >
        <View style={getStyles(theme).watchlistItemContent}>
          <Text style={getStyles(theme).watchlistName}>{item.name}</Text>
          <Text style={getStyles(theme).stockCount}>
            {item.stocks.length} stocks
          </Text>
        </View>
        <Text style={getStyles(theme).addIcon}>+</Text>
      </TouchableOpacity>
    ),
    [handleAddToExisting, theme],
  );

  const renderBottomSheetContent = () => (
    <BottomSheetView style={getStyles(theme).container}>
      <Text style={getStyles(theme).title}>
        Add {stock.ticker} to Watchlist
      </Text>

      <Text style={getStyles(theme).sectionTitle}>Or create new:</Text>
      <TextInput
        style={getStyles(theme).input}
        placeholder="New Watchlist Name"
        placeholderTextColor="#9CA3AF"
        value={newListName}
        onChangeText={setNewListName}
        autoFocus={watchlists.length === 0}
        returnKeyType="done"
        onSubmitEditing={handleCreateAndAdd}
      />

      <View style={getStyles(theme).buttonContainer}>
        <TouchableOpacity
          style={[getStyles(theme).button, getStyles(theme).cancelButton]}
          onPress={hide}
        >
          <Text style={getStyles(theme).cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[getStyles(theme).button, getStyles(theme).createButton]}
          onPress={handleCreateAndAdd}
        >
          <Text style={getStyles(theme).createButtonText}>Create & Add</Text>
        </TouchableOpacity>
      </View>

      {/* Existing Watchlists */}
      <Text style={getStyles(theme).sectionTitle}>Select Watchlist:</Text>
      <FlatList
        data={watchlists}
        renderItem={renderWatchlistItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={getStyles(theme).emptyText}>No watchlists yet.</Text>
        }
        style={getStyles(theme).watchlistsList}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
      />

      {/* Create New Watchlist */}
    </BottomSheetView>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={getStyles(theme).handleIndicator}
      backgroundStyle={getStyles(theme).bottomSheetBackground}
    >
      {renderBottomSheetContent()}
    </BottomSheet>
  );
});

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    handleIndicator: {
      backgroundColor: theme.border,
      width: 36,
      height: 4,
    },
    container: {
      flex: 1,
      padding: 16,
      paddingBottom: Platform.OS === 'ios' ? 2 : 2,
    },
    title: {
      fontSize: theme.font.size.xl,
      fontWeight: 'bold' as any,
      marginBottom: 20,
      textAlign: 'center',
      color: theme.text,
    },
    sectionTitle: {
      fontSize: theme.font.size.md,
      fontWeight: '400' as any,
      marginBottom: 12,
      color: theme.text,
    },
    watchlistsList: {
      // maxHeight: 200,
      // marginBottom: 20,
    },
    watchlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: theme.background,
      borderRadius: 8,
      marginBottom: 8,
    },
    watchlistItemContent: {
      flex: 1,
    },
    watchlistName: {
      fontSize: theme.font.size.md,
      fontWeight: '400' as any,
      color: theme.text,
    },
    stockCount: {
      fontSize: theme.font.size.sm,
      color: theme.subtext,
      marginTop: 2,
    },
    addIcon: {
      fontSize: theme.font.size.lg,
      fontWeight: 'bold' as any,
      color: theme.primary,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.subtext,
      fontStyle: 'italic',
      padding: 20,
      fontSize: theme.font.size.md,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      fontSize: theme.font.size.md,
      backgroundColor: theme.background,
      color: theme.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    button: {
      flex: 1,
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cancelButtonText: {
      color: theme.subtext,
      fontSize: theme.font.size.md,
      fontWeight: '400' as any,
    },
    createButton: {
      backgroundColor: theme.primary,
    },
    createButtonText: {
      color: theme.card,
      fontSize: theme.font.size.md,
      fontWeight: 'bold' as any,
    },
  });

AddToWatchlistSheet.displayName = 'AddToWatchlistSheet';

export default AddToWatchlistSheet;
