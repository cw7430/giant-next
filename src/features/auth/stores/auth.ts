import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  AuthStateData,
  AuthState,
  SignInAndRefreshResponseDtoForClient,
} from '@/features/auth/schema';

const initialState = {
  accessTokenExpiresAtMs: null,
  employeeCode: null,
  employeeName: null,
  authRole: null,
  employeeRole: null,
  department: null,
  team: null,
  position: null,
};

const validateAuthIntegrity = (state: AuthStateData): boolean => {
  const {
    accessTokenExpiresAtMs,
    employeeCode,
    employeeName,
    authRole,
    employeeRole,
    department,
    team,
    position,
  } = state;

  return !!(
    employeeCode &&
    employeeName &&
    authRole &&
    employeeRole &&
    department &&
    team &&
    position &&
    accessTokenExpiresAtMs &&
    Date.now() + 30 * 1000 < accessTokenExpiresAtMs
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      hasHydrated: false,

      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),

      signIn: (data: SignInAndRefreshResponseDtoForClient) =>
        set({
          accessTokenExpiresAtMs: data.accessTokenExpiresAtMs,
          employeeCode: data.employeeCode,
          employeeName: data.employeeName,
          authRole: data.authRole,
          employeeRole: data.employeeRole,
          department: data.department,
          team: data.team,
          position: data.position,
        }),

      checkAuth: () => validateAuthIntegrity(get()),

      signOut: () => set(initialState),
    }),
    {
      name: 'auth-storage',

      partialize: (state) => ({
        accessTokenExpiresAtMs: state.accessTokenExpiresAtMs,
        employeeCode: state.employeeCode,
        employeeName: state.employeeName,
        authRole: state.authRole,
        employeeRole: state.employeeRole,
        department: state.department,
        team: state.team,
        position: state.position,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
