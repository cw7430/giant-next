'use client';

import { useEffect } from 'react';
import {
  AppProgressBar as ProgressBar,
  startProgress,
  stopProgress,
} from 'next-nprogress-bar';

import { useAppState } from '@/common/stores';

export default function LoadingBar() {
  const isLoading = useAppState((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) {
      startProgress();
    } else {
      stopProgress();
    }
  }, [isLoading]);

  return (
    <ProgressBar
      height="3px"
      color="#29d"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
