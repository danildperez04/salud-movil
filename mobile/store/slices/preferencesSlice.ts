// store/slices/preferencesSlice.ts
import { StateCreator } from 'zustand';
import type {
  AccessibilityPreferences,
  NotificationPreferences,
  SecurityPreferences,
} from '@/types/preferences';
import { PreferencesSlice } from '../types';

export const DEFAULT_ACCESSIBILITY: AccessibilityPreferences = {
  textSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  simpleMode: false,
  readAloud: false,
};

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  medications: true,
  appointments: true,
  indicators: true,
  news: false,
};

const DEFAULT_SECURITY: SecurityPreferences = {
  fingerprint: true,
  faceRecognition: false,
  pinFallback: true,
};

export const createPreferencesSlice: StateCreator<PreferencesSlice> = (set) => ({
  accessibility: DEFAULT_ACCESSIBILITY,
  language: 'es',
  notificationPreferences: DEFAULT_NOTIFICATIONS,
  securityPreferences: DEFAULT_SECURITY,

  setAccessibility: (patch) =>
    set((state) => ({ accessibility: { ...state.accessibility, ...patch } })),
  resetAccessibility: () => set({ accessibility: DEFAULT_ACCESSIBILITY }),
  setLanguage: (language) => set({ language }),
  setNotificationPreferences: (notificationPreferences) => set({ notificationPreferences }),
  setSecurityPreferences: (securityPreferences) => set({ securityPreferences }),
});
