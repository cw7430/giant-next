'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { useAppConfigStore, useDialogModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { refreshAction } from '@/features/auth/server/actions';
import type { RefreshRequestDto } from '@/features/auth/schema';

interface Props {
  checkAccessToken: boolean;
}

export default function AuthInitializer({ checkAccessToken }: Props) {
  const router = useRouter();
  const { isAutoSignIn } = useAppConfigStore();
  const { showModal } = useDialogModalState();
  const { signIn, signOut } = useAuthStore();
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refreshMutation = useMutation({
    mutationKey: ['auth', 'refresh'],
    mutationFn: async (req: RefreshRequestDto) => {
      return await refreshAction(req);
    },
  });

  const clearRefreshTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const refresh = useCallback(
    async (req: RefreshRequestDto, isRecovery: boolean = false) => {
      try {
        const response = await refreshMutation.mutateAsync(req);
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
      } catch {
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
    },
    [router, signIn, signOut, showModal],
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

      if (checkAccessToken && isAuthValid && currentExpiry) {
        scheduleRefresh(currentExpiry, req);
        return;
      }

      const newExpiresAt = await refresh(req, true);
      if (newExpiresAt) {
        scheduleRefresh(newExpiresAt, req);
      }
    },
    [scheduleRefresh, refresh, checkAccessToken],
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const req: RefreshRequestDto = { isAuto: isAutoSignIn };
    recoverAuth(req);

    return () => clearRefreshTimer();
  }, [hasHydrated, isAutoSignIn, recoverAuth, clearRefreshTimer]);

  return null;
}
