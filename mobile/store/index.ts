// store/index.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UISlice } from './types';
import { createUISlice } from './slices/uiSlice';

// A medida que agregues slices (auth, settings, etc), combinalos acá:
// type AppState = UISlice & AuthSlice & SettingsSlice;
type AppState = UISlice;

export const useAppStore = create<AppState>()(
  devtools(
    (...a) => ({
      ...createUISlice(...a),
      // ...createAuthSlice(...a),
    }),
    { name: 'AppStore', enabled: __DEV__ },
  ),
);
