import React from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { WatchlistProvider } from './src/context/WatchlistContext';

const App = () => (
  <WatchlistProvider>
    <MainNavigator />
  </WatchlistProvider>
);

export default App;
