// store/slices/authSlice.ts
import { StateCreator } from 'zustand';
import type { AuthResponse } from '@/types/auth';
import { AuthSlice } from '../types';

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  hasHydrated: false,

  setSession: (session: AuthResponse) =>
    set({
      user: session.user,
      accessToken: session.accessToken,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),

  setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
});
