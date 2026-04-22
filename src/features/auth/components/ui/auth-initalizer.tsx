'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';

import { useAppConfigStore, useDialogModalState } from '@/common/stores';
import { useAuthStore } from '@/features/auth/stores';
import { refreshAction } from '@/features/auth/server/actions';
import type { RefreshRequestDto } from '@/features/auth/schema';
import { AUTH_KEYS } from '@/features/auth/constants';

interface Props {
  checkAccessToken: boolean;
}

export default function AuthInitializer({ checkAccessToken }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isAutoSignIn = useAppConfigStore((s) => s.isAutoSignIn);
  const showModal = useDialogModalState((s) => s.showModal);
  const { signOut, signIn, hasHydrated } = useAuthStore(
    useShallow((s) => ({
      signOut: s.signOut,
      signIn: s.signIn,
      hasHydrated: s.hasHydrated,
    })),
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const { mutateAsync: refreshMutate } = useMutation({
    mutationKey: AUTH_KEYS.refresh,
    mutationFn: refreshAction,
    onSuccess: (response, variables) => {
      if (response.code === 'SU') {
        const data = response.result;
        signIn(data);
        scheduleRefresh(data.accessTokenExpiresAtMs, variables);
      } else {
        handleAuthFailure();
      }
    },
    onError: () => {
      handleAuthFailure();
    },
  });

  const handleAuthFailure = useCallback(() => {
    signOut();
    clearRefreshTimer();
    showModal({
      modal: 'alert',
      title: '세션만료',
      text: '세션이 만료되었습니다. 로그아웃합니다.',
      handleAfterClose: () => {
        router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      },
    });
  }, [signOut, clearRefreshTimer, showModal, router, pathname]);

  const scheduleRefresh = useCallback(
    (expiresAt: number, req: RefreshRequestDto) => {
      clearRefreshTimer();

      const now = Date.now();
      const timeUntilRefresh = Math.max(0, expiresAt - now - 2 * 60 * 1000);

      timerRef.current = setTimeout(() => {
        refreshMutate(req);
      }, timeUntilRefresh);
    },
    [refreshMutate, clearRefreshTimer],
  );

  const recoverAuth = useCallback(
    async (req: RefreshRequestDto) => {
      const { accessTokenExpiresAtMs, checkAuth } = useAuthStore.getState();
      const isAuthValid = checkAuth();

      if (checkAccessToken && isAuthValid && accessTokenExpiresAtMs) {
        scheduleRefresh(accessTokenExpiresAtMs, req);
        return;
      }

      await refreshMutate(req);
    },
    [scheduleRefresh, refreshMutate, checkAccessToken],
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const req: RefreshRequestDto = { isAuto: isAutoSignIn };
    recoverAuth(req);

    return () => clearRefreshTimer();
  }, [hasHydrated, isAutoSignIn, recoverAuth, clearRefreshTimer]);

  return null;
}
