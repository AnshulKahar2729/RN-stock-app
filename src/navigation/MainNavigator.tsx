import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import your screens
import HomeScreen from '../screens/Home/HomeScreen';
import WatchlistHomeScreen from '../screens/Watchlist/WatchlistHomeScreen';
import ProductScreen from '../screens/Home/ProductScreen';
import ViewAllScreen from '../screens/Home/ViewAllScreen';
import WatchlistScreen from '../screens/Watchlist/WatchListScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// Tab Navigator Component
const TabNavigator = React.memo(() => {
  const tabBarIcon = (
    { focused, color, size }: { focused: boolean; color: string; size: number },
    routeName: string
  ) => {
    let iconName: string;
    if (routeName === 'HomeTab') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (routeName === 'WatchlistTab') {
      iconName = focused ? 'bookmark' : 'bookmark-outline';
    } else {
      iconName = 'help-outline';
    }
    return <Icon name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => tabBarIcon(props, route.name),
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistHomeScreen}
        options={{ title: 'Watchlist' }}
      />
    </Tab.Navigator>
  );
});

// Main Navigator with shared screens at root level
const MainNavigator = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tab Navigator as the main screen */}
        <RootStack.Screen name="MainTabs" component={TabNavigator} />
        {/* Shared screens accessible from any tab */}
        <RootStack.Screen name="Product" component={ProductScreen} />
        <RootStack.Screen name="ViewAll" component={ViewAllScreen} />
        <RootStack.Screen name="WatchlistDetail" component={WatchlistScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
);

export default MainNavigator;