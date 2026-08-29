// store/slices/uiSlice.ts
import { StateCreator } from 'zustand';
import { UISlice } from '../types';

export const createUISlice: StateCreator<UISlice> = (set) => ({
  isBottomSheetOpen: false,
  openBottomSheet: () => set({ isBottomSheetOpen: true }),
  closeBottomSheet: () => set({ isBottomSheetOpen: false }),
});
