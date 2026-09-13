// lib/storage.ts
import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'salud-movil-storage',
});

export const storageHelpers = {
  setItem: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `storageHelpers.setItem: failed to serialize value for key "${key}":${message}`,
      );
    }
  },

  getItem: <T>(key: string): T | null => {
    const value = storage.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  removeItem: (key: string): void => {
    storage.remove(key);
  },

  clearAll: (): void => {
    storage.clearAll();
  },
};
