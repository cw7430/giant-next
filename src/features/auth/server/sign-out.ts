'use server';

import { cookies } from 'next/headers';

import { type SignOutRequestDto } from '@/features/auth/schema';
import { apiPost } from '@/common/api/configs';
import { type ApiSuccessSingle } from '@/common/api/schema';

export const signOutAction = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  const body: SignOutRequestDto = { refreshToken };

  try {
    await apiPost<ApiSuccessSingle>('/auth/sign-out', body);
  } catch (error) {
    console.error('Sign-out API call failed:', error);
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
};
