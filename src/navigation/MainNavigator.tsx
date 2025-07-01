import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { DefaultTheme, DarkTheme as NavigationDarkTheme, Theme as NavigationTheme } from '@react-navigation/native';

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
    <WatchlistStack.Screen
      name="WatchlistMain"
      component={WatchlistHomeScreen}
    />
    <WatchlistStack.Screen name="Product" component={ProductScreen} />
    <WatchlistStack.Screen name="ViewAll" component={ViewAllScreen} />
    <WatchlistStack.Screen name="WatchlistDetail" component={WatchlistScreen} />
  </WatchlistStack.Navigator>
);

// Tab Navigator Component
const TabNavigator = React.memo(() => {
  const { theme } = useTheme();
  const tabBarIcon = (
    { focused, color, size }: { focused: boolean; color: string; size: number },
    routeName: string,
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
        tabBarIcon: props => tabBarIcon(props, route.name),
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: { backgroundColor: theme.header },
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
const MainNavigator = () => {
  const { theme, mode } = useTheme();
  const navigationTheme: NavigationTheme = {
    ...(mode === 'dark' ? NavigationDarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? NavigationDarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.header,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
      notification: theme.accent,
    },
  };
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default MainNavigator;
