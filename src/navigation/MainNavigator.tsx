import React, { Suspense, lazy, useCallback, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { DefaultTheme, DarkTheme as NavigationDarkTheme, Theme as NavigationTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Lazy load screens for better performance
const HomeScreen = lazy(() => import('../screens/Home/HomeScreen'));
const WatchlistHomeScreen = lazy(() => import('../screens/Watchlist/WatchlistHomeScreen'));
const ProductScreen = lazy(() => import('../screens/Home/ProductScreen'));
const ViewAllScreen = lazy(() => import('../screens/Home/ViewAllScreen'));
const WatchlistScreen = lazy(() => import('../screens/Watchlist/WatchListScreen'));

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const WatchlistStack = createNativeStackNavigator();

// Loading component for lazy loaded screens
const LazyLoadingScreen = React.memo(() => {
  const { theme } = useTheme();
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Optimized screen wrapper for lazy loading
const LazyScreen = React.memo<{ component: React.ComponentType<any> }>(({ component: Component }) => (
  <Suspense fallback={<LazyLoadingScreen />}>
    <Component />
  </Suspense>
));

// Memoized Home Stack Navigator
const HomeStackNavigator = React.memo(() => {
  const screenOptions = useMemo(() => ({ headerShown: false }), []);
  
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen 
        name="HomeMain" 
        component={() => <LazyScreen component={HomeScreen} />} 
      />
      <HomeStack.Screen 
        name="Product" 
        component={() => <LazyScreen component={ProductScreen} />} 
      />
      <HomeStack.Screen 
        name="ViewAll" 
        component={() => <LazyScreen component={ViewAllScreen} />} 
      />
      <HomeStack.Screen 
        name="WatchlistDetail" 
        component={() => <LazyScreen component={WatchlistScreen} />} 
      />
    </HomeStack.Navigator>
  );
});

// Memoized Watchlist Stack Navigator
const WatchlistStackNavigator = React.memo(() => {
  const screenOptions = useMemo(() => ({ headerShown: false }), []);
  
  return (
    <WatchlistStack.Navigator screenOptions={screenOptions}>
      <WatchlistStack.Screen
        name="WatchlistMain"
        component={() => <LazyScreen component={WatchlistHomeScreen} />}
      />
      <WatchlistStack.Screen 
        name="Product" 
        component={() => <LazyScreen component={ProductScreen} />} 
      />
      <WatchlistStack.Screen 
        name="ViewAll" 
        component={() => <LazyScreen component={ViewAllScreen} />} 
      />
      <WatchlistStack.Screen 
        name="WatchlistDetail" 
        component={() => <LazyScreen component={WatchlistScreen} />} 
      />
    </WatchlistStack.Navigator>
  );
});

// Optimized Tab Navigator Component
const TabNavigator = React.memo(() => {
  const { theme } = useTheme();
  
  const tabBarIcon = useCallback((
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
  }, []);

  const screenOptions = useCallback(({ route }: { route: any }) => ({
    tabBarIcon: (props: any) => tabBarIcon(props, route.name),
    tabBarActiveTintColor: theme.tabBarActive,
    tabBarInactiveTintColor: theme.tabBarInactive,
    tabBarStyle: { backgroundColor: theme.header },
    headerShown: false,
  }), [theme, tabBarIcon]);

  const homeTabOptions = useMemo(() => ({ title: 'Home' }), []);
  const watchlistTabOptions = useMemo(() => ({ title: 'Watchlist' }), []);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={homeTabOptions}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStackNavigator}
        options={watchlistTabOptions}
      />
    </Tab.Navigator>
  );
});

// Main Navigator
const MainNavigator = React.memo(() => {
  const { theme, mode } = useTheme();
  
  const navigationTheme: NavigationTheme = useMemo(() => ({
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
  }), [mode, theme]);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
});

MainNavigator.displayName = 'MainNavigator';
HomeStackNavigator.displayName = 'HomeStackNavigator';
WatchlistStackNavigator.displayName = 'WatchlistStackNavigator';
TabNavigator.displayName = 'TabNavigator';
LazyLoadingScreen.displayName = 'LazyLoadingScreen';
LazyScreen.displayName = 'LazyScreen';

export default MainNavigator;
