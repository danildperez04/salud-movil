// lib/zustand-mmkv-storage.ts
import type { StateStorage } from 'zustand/middleware';
import { storage } from './storage';

export const zustandMMKVStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    return storage.getString(name) ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};
