'use client';

import { useEffect } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import {
  AppProgressBar as ProgressBar,
  startProgress,
  stopProgress,
} from 'next-nprogress-bar';

export default function LoadingBar() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching + isMutating > 0;

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
