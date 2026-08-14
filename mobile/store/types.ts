// store/types.ts
// Cada slice define su propio tipo. A medida que agregues features
// (auth, appointments, notifications, etc), sumá un tipo acá y su
// slice correspondiente en store/slices/.

export type UISlice = {
  isBottomSheetOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
};

// Ejemplo de lo que vendría después (no implementado todavía):
// export type AuthSlice = {
//   user: User | null;
//   isAuthenticated: boolean;
//   setUser: (user: User) => void;
//   logout: () => void;
// };
