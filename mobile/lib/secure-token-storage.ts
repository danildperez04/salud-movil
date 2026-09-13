// lib/secure-token-storage.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'salud-movil-access-token';

export const secureTokenStorage = {
  getToken: (): Promise<string | null> => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string): Promise<void> => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: (): Promise<void> => {
    return SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
  },
};
