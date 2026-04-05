'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import {
  useAppConfigStore,
  useAppState,
  useDialogModalState,
} from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { refreshAction, meAction } from '@/features/auth/server/actions';
import type { RefreshRequestDto } from '@/features/auth/schema';

export default function AuthInitializer() {
  const router = useRouter();
  const { isAutoSignIn } = useAppConfigStore();
  const { setLoading } = useAppState();
  const { showModal } = useDialogModalState();
  const { signIn, signOut } = useAuthStore();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const refresh = useCallback(
    async (req: RefreshRequestDto, isRecovery: boolean = false) => {
      if (isRecovery) setLoading(true);

      try {
        const response = await refreshAction(req);
        if (response.code !== 'SU') {
          signOut();
          showModal({
            modal: 'alert',
            title: '세션만료',
            text: '세션이 만료되었습니다. 로그아웃합니다.',
            handleAfterClose: () => {
              router.replace('/sign-in');
            },
          });
          return null;
        }

        const data = response.result;
        signIn(data);

        return data.accessTokenExpiresAtMs;
      } finally {
        if (isRecovery) setLoading(false);
      }
    },
    [router, signIn, signOut, setLoading, showModal],
  );

  const scheduleRefresh = useCallback(
    (expiresAt: number, req: RefreshRequestDto) => {
      clearRefreshTimer();

      const now = Date.now();
      const timeUntilRefresh = Math.max(0, expiresAt - now - 2 * 60 * 1000);

      timerRef.current = setTimeout(async () => {
        const newExpiresAt = await refresh(req);
        if (newExpiresAt) scheduleRefresh(newExpiresAt, req);
      }, timeUntilRefresh);
    },
    [refresh, clearRefreshTimer],
  );

  const recoverAuth = useCallback(
    async (req: RefreshRequestDto) => {
      const currentState = useAuthStore.getState();
      const currentExpiry = currentState.accessTokenExpiresAtMs;
      const isAuthValid = currentState.checkAuth();

      const me = await meAction();

      if (me && isAuthValid && currentExpiry) {
        scheduleRefresh(currentExpiry, req);
        return;
      }

      const newExpiresAt = await refresh(req, true);
      if (newExpiresAt) {
        scheduleRefresh(newExpiresAt, req);
      }
    },
    [scheduleRefresh, refresh],
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const req: RefreshRequestDto = { isAuto: isAutoSignIn };
    recoverAuth(req);

    return () => clearRefreshTimer();
  }, [hasHydrated, isAutoSignIn, recoverAuth, clearRefreshTimer]);

  return null;
}
