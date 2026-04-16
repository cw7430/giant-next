'use server';

import {
  ApiError,
  apiPost,
  apiPatch,
  clientResponseSingle,
} from '@/common/api/configs';
import type { ApiSuccessSingle } from '@/common/api/schema';
import type {
  CreateEmployeeProfileRequestDto,
  UpdateEmployeeProfileRequestDto,
} from '@/features/hr/schema';

export const createProfile = async (body: CreateEmployeeProfileRequestDto) =>
  clientResponseSingle(async () => {
    const response = await apiPost<ApiSuccessSingle>('/hr/profiles', body, {
      authType: 'access',
    });

    if (!response) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }
  });

export const updateProfile = async (body: UpdateEmployeeProfileRequestDto) =>
  clientResponseSingle(async () => {
    const response = await apiPatch<ApiSuccessSingle>('/hr/profiles', body, {
      authType: 'access',
    });

    if (!response) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }
  });
