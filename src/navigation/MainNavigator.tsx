import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import WatchlistScreen from '../screens/Watchlist/WatchlistScreen';
import ProductScreen from '../screens/Home/ProductScreen';
import ViewAllScreen from '../screens/Home/ViewAllScreen';
import AddToWatchlistModal from '../screens/Home/AddToWatchlistModal';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Product" component={ProductScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ViewAll" component={ViewAllScreen} options={{ headerShown: false }} />
      <HomeStack.Screen
        name="AddToWatchlistModal"
        component={AddToWatchlistModal}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

const MainNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator>
      {/* use icon */}
      <Tab.Screen
        name="HomeTab"
       
        component={HomeStackScreen}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{ title: 'Watchlist' }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
