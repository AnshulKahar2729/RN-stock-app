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
    <BottomSheetView style={styles.bottomSheetContent}>
      <Text style={styles.bottomSheetTitle}>Create New Watchlist</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter watchlist name"
        placeholderTextColor="#9CA3AF"
        value={newWatchlistName}
        onChangeText={setNewWatchlistName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleCreateWatchlist}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={hide}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateWatchlist}
        >
          <Text style={styles.createButtonText}>Create</Text>
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
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      {renderBottomSheetContent()}
    </BottomSheet>
  );
});

CreateWatchlist.displayName = 'CreateWatchlist';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleIndicator: {
    backgroundColor: '#E5E7EB',
    width: 36,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 2 : 2,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FAFAFA',
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
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#374151',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateWatchlist;
