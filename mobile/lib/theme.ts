// lib/theme.ts
import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';

// radius: espejo de --radius en global.css
export const RADIUS = 12;

// espejo exacto de global.css
export const COLORS = {
  light: {
    background: '#FFFFFF',
    foreground: '#1A2129',
    card: '#FFFFFF',
    cardForeground: '#1A2129',
    popover: '#FFFFFF',
    popoverForeground: '#1A2129',
    primary: '#2DB79A',
    primaryForeground: '#0E2A3A',
    secondary: '#135E6D',
    secondaryForeground: '#FFFFFF',
    muted: '#E5E7EB',
    mutedForeground: '#6B7280',
    accent: '#77D1B5',
    accentForeground: '#0E2A3A',
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    border: '#E5E7EB',
    input: '#E5E7EB',
    ring: '#2DB79A',
  },
  dark: {
    background: '#0E2A3A',
    foreground: '#FFFFFF',
    card: '#0E2A3A',
    cardForeground: '#FFFFFF',
    popover: '#0E2A3A',
    popoverForeground: '#FFFFFF',
    primary: '#2DB79A',
    primaryForeground: '#0E2A3A',
    secondary: '#77D1B5',
    secondaryForeground: '#0E2A3A',
    muted: '#135E6D',
    mutedForeground: '#E5E7EB',
    accent: '#2D7F8E',
    accentForeground: '#FFFFFF',
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    border: '#135E6D',
    input: '#135E6D',
    ring: '#2DB79A',
  },
} as const;

// Theme para el ThemeProvider de React Navigation (usa un subconjunto de COLORS)
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: COLORS.light.background,
      border: COLORS.light.border,
      card: COLORS.light.card,
      notification: COLORS.light.destructive,
      primary: COLORS.light.primary,
      text: COLORS.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: COLORS.dark.background,
      border: COLORS.dark.border,
      card: COLORS.dark.card,
      notification: COLORS.dark.destructive,
      primary: COLORS.dark.primary,
      text: COLORS.dark.foreground,
    },
  },
};
