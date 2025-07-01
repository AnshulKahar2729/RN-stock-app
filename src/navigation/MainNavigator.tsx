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
const HomeStack = createNativeStackNavigator();
const WatchlistStack = createNativeStackNavigator();

// Home Stack Navigator
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="Product" component={ProductScreen} />
    <HomeStack.Screen name="ViewAll" component={ViewAllScreen} />
    <HomeStack.Screen name="WatchlistDetail" component={WatchlistScreen} />
  </HomeStack.Navigator>
);

// Watchlist Stack Navigator
const WatchlistStackNavigator = () => (
  <WatchlistStack.Navigator screenOptions={{ headerShown: false }}>
    <WatchlistStack.Screen name="WatchlistMain" component={WatchlistHomeScreen} />
    <WatchlistStack.Screen name="Product" component={ProductScreen} />
    <WatchlistStack.Screen name="ViewAll" component={ViewAllScreen} />
    <WatchlistStack.Screen name="WatchlistDetail" component={WatchlistScreen} />
  </WatchlistStack.Navigator>
);

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
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStackNavigator}
        options={{ title: 'Watchlist' }}
      />
    </Tab.Navigator>
  );
});

// Main Navigator
const MainNavigator = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  </SafeAreaProvider>
);

export default MainNavigator;