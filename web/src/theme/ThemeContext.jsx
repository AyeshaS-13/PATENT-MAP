import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';

const ThemeContext = createContext({
  themeMode: 'system', // 'light' | 'dark' | 'system'
  setThemeMode: (mode) => {},
  actualMode: 'dark'
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('patent_map_theme_mode') || 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleSetThemeMode = (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setThemeMode(mode);
      localStorage.setItem('patent_map_theme_mode', mode);
    }
  };

  const actualMode = useMemo(() => {
    if (themeMode === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, systemPrefersDark]);

  const muiTheme = useMemo(() => {
    const isDark = actualMode === 'dark';
    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: isDark ? '#6366f1' : '#4f46e5',
          light: '#818cf8',
          dark: '#3730a3',
        },
        secondary: {
          main: isDark ? '#06b6d4' : '#0891b2',
        },
        background: {
          default: isDark ? '#0b0f19' : '#f8fafc',
          paper: isDark ? '#111827' : '#ffffff',
        },
        text: {
          primary: isDark ? '#f3f4f6' : '#1e293b',
          secondary: isDark ? '#9ca3af' : '#64748b',
        },
      },
      typography: {
        fontFamily: '"Inter", "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: { fontWeight: 800 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 10,
              padding: '8px 20px',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              backgroundImage: 'none',
              boxShadow: isDark
                ? '0 4px 20px 0 rgba(0,0,0,0.4)'
                : '0 4px 20px 0 rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            },
          },
        },
      },
    });
  }, [actualMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: handleSetThemeMode, actualMode }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
