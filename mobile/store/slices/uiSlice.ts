// store/slices/uiSlice.ts
import { StateCreator } from 'zustand';
import { UISlice } from '../types';

// Un "slice" es una porción de estado con sus propias acciones.
// StateCreator<T> tipa correctamente `set` y `get` cuando el slice
// se combina con otros dentro de un store más grande.
export const createUISlice: StateCreator<UISlice> = (set) => ({
  isBottomSheetOpen: false,
  openBottomSheet: () => set({ isBottomSheetOpen: true }),
  closeBottomSheet: () => set({ isBottomSheetOpen: false }),
});
