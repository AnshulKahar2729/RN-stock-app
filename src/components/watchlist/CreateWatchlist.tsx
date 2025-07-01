import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';  
import { useTheme } from '../../context/ThemeContext';
import { Theme } from '../../utils';

interface CreateWatchlistBottomSheetProps {
  onCreateWatchlist: (name: string) => void;
}

export interface CreateWatchlistBottomSheetRef {
  show: () => void;
  hide: () => void;
}

const CreateWatchlist = forwardRef<
  CreateWatchlistBottomSheetRef,
  CreateWatchlistBottomSheetProps
>(({ onCreateWatchlist }, ref) => {
  const [newWatchlistName, setNewWatchlistName] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '30%'], []);
  const { theme } = useTheme();

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setNewWatchlistName('');
    }
  }, []);

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

  const handleCreateWatchlist = () => {
    if (newWatchlistName.trim()) {
      onCreateWatchlist(newWatchlistName.trim());
      hide();
      setNewWatchlistName('');
    } else {
      Alert.alert('Error', 'Please enter a watchlist name');
    }
  };

  const renderBottomSheetContent = () => (
    <BottomSheetView style={getStyles(theme).bottomSheetContent}>
      <Text style={getStyles(theme).bottomSheetTitle}>Create New Watchlist</Text>
      <TextInput
        style={getStyles(theme).input}
        placeholder="Enter watchlist name"
        placeholderTextColor="#9CA3AF"
        value={newWatchlistName}
        onChangeText={setNewWatchlistName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleCreateWatchlist}
      />
      <View style={getStyles(theme).buttonRow}>
        <TouchableOpacity
          style={[getStyles(theme).button, getStyles(theme).cancelButton]}
          onPress={hide}
        >
          <Text style={getStyles(theme).cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[getStyles(theme).button, getStyles(theme).createButton]}
          onPress={handleCreateWatchlist}
        >
          <Text style={getStyles(theme).createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
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

CreateWatchlist.displayName = 'CreateWatchlist';

const getStyles = (theme: Theme) => StyleSheet.create({
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
  bottomSheetContent: {
    flex: 1,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 2 : 2,
  },
  bottomSheetTitle: {
    fontSize: theme.font.size.lg,
    fontWeight: "bold" as any,
    marginBottom: 20,
    color: theme.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: theme.font.size.md,
    color: theme.text,
    backgroundColor: theme.background,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
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
    fontWeight: "medium" as any,
  },
  createButton: {
    backgroundColor: theme.accent,
  },
  createButtonText: {
    color: theme.card,
    fontSize: theme.font.size.md,
    fontWeight: "medium" as any,
  },
});

export default CreateWatchlist;
