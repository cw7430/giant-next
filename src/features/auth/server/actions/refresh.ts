'use server';

import {
  ApiError,
  apiPost,
  clientResponseWithResult,
} from '@/common/api/configs';
import type { ApiSuccessWithResult } from '@/common/api/schema';
import {
  type RefreshRequestDto,
  SignInAndRefreshResponseDtoForServer,
} from '@/features/auth/schema';
import { signInAndRefresh } from './shared';

export const refreshAction = async (body: RefreshRequestDto) =>
  clientResponseWithResult(async () => {
    const response = await apiPost<
      ApiSuccessWithResult<SignInAndRefreshResponseDtoForServer>
    >('/auth/refresh', body, { authType: 'refresh' });

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    return signInAndRefresh(response);
  });
