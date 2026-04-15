'use server';

import {
  clientResponseWithResult,
  apiPost,
  ApiError,
} from '@/common/api/configs';
import type { ApiSuccessWithResult } from '@/common/api/schema';
import {
  type SignInRequestDto,
  type SignInAndRefreshResponseDtoForServer,
} from '@/features/auth/schema';
import { signInAndRefresh } from './shared';

export const signInAction = async (body: SignInRequestDto) =>
  clientResponseWithResult(async () => {
    const response = await apiPost<
      ApiSuccessWithResult<SignInAndRefreshResponseDtoForServer>
    >('/auth/sign-in', body);

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    return signInAndRefresh(response);
  });
