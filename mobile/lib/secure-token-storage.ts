// lib/secure-token-storage.ts
//
// El accessToken vive acá, NO en MMKV. expo-secure-store usa Keychain en iOS
// y Keystore/EncryptedSharedPreferences en Android — cifrado a nivel de SO,
// a diferencia de MMKV que guarda en texto plano dentro del sandbox de la app.
// El resto del estado de sesión (user, isAuthenticated) sí puede seguir en
// MMKV vía Zustand persist: no es secreto, solo el token lo es.
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'salud-movil-access-token';

export const secureTokenStorage = {
  getToken: (): Promise<string | null> => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string): Promise<void> => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: (): Promise<void> => {
    // deleteItemAsync tira error si la clave no existe en algunas plataformas;
    // lo ignoramos porque "borrar algo que ya no está" no debería romper el logout.
    return SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => undefined);
  },
};
