import 'react-native-reanimated'; 
import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReactQueryProvider } from './src/lib/QueryProvider';
import { ThemeProvider } from './src/context/ThemeContext';

const App = () => (
  <ReactQueryProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <WatchlistProvider>
          <MainNavigator />
        </WatchlistProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  </ReactQueryProvider>
);

export default App;
