'use server';

import {
  ApiError,
  apiPost,
  clientResponseWithResult,
} from '@/common/api/configs';
import type { ApiSuccessWithResult } from '@/common/api/schema';
import {
  type EmployeeCodeResponseDto,
  employeeCodeResponseSchema,
} from '@/features/hr/schema';

export const getEmployeeCode = async () =>
  clientResponseWithResult(async () => {
    const response = await apiPost<
      ApiSuccessWithResult<EmployeeCodeResponseDto>
    >('/hr/employee-code', undefined, { authType: 'access' });

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    const validation = employeeCodeResponseSchema.safeParse(response.result);

    if (!validation.success) {
      throw new ApiError('ISE', '서버 응답 형식이 올바르지 않습니다.');
    }

    return validation.data;
  });
