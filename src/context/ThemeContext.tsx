import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../utils';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_KEY = 'APP_THEME_MODE';

export const ThemeProvider = React.memo<{ children: ReactNode }>(({ children }) => {
  const getSystemTheme = useCallback((): ThemeMode => 
    (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'), []);
  
  const [mode, setMode] = useState<ThemeMode>(getSystemTheme());

  useEffect(() => {
    let isMounted = true;
    
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_KEY);
        if (isMounted && (stored === 'light' || stored === 'dark')) {
          setMode(stored);
        }
      } catch (error) {
        console.warn('Failed to load theme from storage:', error);
      }
    };

    loadTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(THEME_KEY, next).catch(error => 
        console.warn('Failed to save theme to storage:', error)
      );
      return next;
    });
  }, []);

  const theme = useMemo(() => 
    mode === 'dark' ? darkTheme : lightTheme, [mode]);

  const contextValue = useMemo(() => ({
    theme,
    mode,
    toggleTheme,
  }), [theme, mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = 'ThemeProvider';

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}; 