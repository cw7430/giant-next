'use server';

import { cookies } from 'next/headers';

import { ApiSuccessWithResult } from '@/common/api/schema';
import { ApiError } from '@/common/api/configs';
import {
  type SignInAndRefreshResponseDtoForServer,
  signInAndRefreshResponseSchemaForServer,
} from '@/features/auth/schema';

export const signInAndRefresh = async (
  response: ApiSuccessWithResult<SignInAndRefreshResponseDtoForServer>,
) => {
  const cookieStore = await cookies();

  const validation = signInAndRefreshResponseSchemaForServer.safeParse(
    response.result,
  );

  if (!validation.success) {
    throw new ApiError('ISE', '서버 응답 형식이 올바르지 않습니다.');
  }

  const result = validation.data;

  const refreshMaxAge = result.isAuto
    ? Math.max(
        0,
        Math.floor((result.refreshTokenExpiresAtMs - Date.now()) / 1000),
      )
    : undefined;

  const isSecure = process.env.NEXT_PUBLIC_APP_ENV !== 'local';

  cookieStore.set({
    name: 'accessToken',
    value: result.accessToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
  });

  cookieStore.set({
    name: 'refreshToken',
    value: result.refreshToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
    ...(refreshMaxAge !== undefined && { maxAge: refreshMaxAge }),
  });

  const {
    refreshToken: _refreshToken,
    refreshTokenExpiresAtMs: _refreshTokenExpiresAtMs,
    isAuto: _isAuto,
    accessToken: _accessToken,
    ...clientData
  } = result;

  return clientData;
};
