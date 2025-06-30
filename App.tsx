import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/Home/HomeScreen';
import WatchlistScreen from './src/screens/Watchlist/WatchlistScreen';

const Tab = createBottomTabNavigator();

const screenOptions = ({ route }: { route: any }) => ({
  tabBarIcon: ({ color, size }: { color: string; size: number }) => {
    const iconName = route.name === 'Home' ? 'home' : 'bookmark';
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  headerShown: false,
});

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Watchlist" component={WatchlistScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
