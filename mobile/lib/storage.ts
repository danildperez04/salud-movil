// lib/storage.ts
import { createMMKV } from 'react-native-mmkv';

// Una sola instancia para toda la app. MMKV es sincrónico y muchísimo
// más rápido que AsyncStorage (no usa un puente async por operación).
export const storage = createMMKV({
  id: 'salud-movil-storage',
});

// Helpers tipados: evitan repetir JSON.parse/stringify y el manejo
// de errores en cada lugar donde se usa storage.
export const storageHelpers = {
  setItem: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
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
