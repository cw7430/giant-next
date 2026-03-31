import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppConfigState {
  isAutoSignIn: boolean;
  setAutoSignIn: (isAutoSignIn: boolean) => void;
}

interface AppState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      isAutoSignIn: false,
      setAutoSignIn: (isAutoSignIn: boolean) => set({ isAutoSignIn })
    }),
    {
      name: 'app-config-storage',
    },
  ),
);

export const useAppState = create<AppState>()((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
