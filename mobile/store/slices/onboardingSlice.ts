// store/slices/onboardingSlice.ts
import { StateCreator } from 'zustand';
import { OnboardingSlice } from '../types';

export const createOnboardingSlice: StateCreator<OnboardingSlice> = (set) => ({
  hasSeenOnboarding: false,
  markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
});
