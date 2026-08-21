import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, setTokenGetter } from '../lib/api';
import type { ApiUser } from '../types';

interface AuthState {
  token: string | null;
  user: ApiUser | null;
  bootstrapReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      bootstrapReady: false,
      login: async (email, password) => {
        const response = await api.login(email, password);
        set({ token: response.accessToken, user: response.user });
      },
      logout: () => set({ token: null, user: null }),
      bootstrap: async () => {
        await Promise.resolve();
        if (!get().token) {
          set({ bootstrapReady: true });
          return;
        }
        try {
          const user = await api.me();
          set({ user, bootstrapReady: true });
        } catch {
          set({ token: null, user: null, bootstrapReady: true });
        }
      },
    }),
    {
      name: 'sm-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

setTokenGetter(() => useAuthStore.getState().token);
