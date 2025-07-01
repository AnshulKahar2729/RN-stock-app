import 'react-native-reanimated'; 
import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <WatchlistProvider>
      <MainNavigator />
    </WatchlistProvider>
  </GestureHandlerRootView>
);

export default App;
