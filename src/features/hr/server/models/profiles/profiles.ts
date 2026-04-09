import {
  ApiError,
  apiGet,
  clientResponseWithResult,
} from '@/common/api/configs';
import { ApiSuccessWithResult } from '@/common/api/schema';
import {
  EmployeeProfileListRequestDto,
  EmployeeProfileListResponseDto,
  EmployeeProfileResponseDto,
  employeeProfileListResponseSchema,
  employeeProfileResponseSchema,
} from '@/features/hr/schema';

export const getEmployeeProfiles = async (
  param: EmployeeProfileListRequestDto,
) =>
  clientResponseWithResult(async () => {
    const response = await apiGet<
      ApiSuccessWithResult<EmployeeProfileListResponseDto>
    >('/hr/profiles', param, { authType: 'access' });

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    const validation = employeeProfileListResponseSchema.safeParse(
      response.result,
    );

    if (!validation.success) {
      throw new ApiError('ISE', '서버 응답 형식이 올바르지 않습니다.');
    }

    return validation.data;
  });

export const getEmployeeProfile = async (id: string) =>
  clientResponseWithResult(async () => {
    const response = await apiGet<
      ApiSuccessWithResult<EmployeeProfileResponseDto>
    >(`/hr/profiles/${id}`, undefined, { authType: 'access' });

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    const validation = employeeProfileResponseSchema.safeParse(response.result);

    if (!validation.success) {
      throw new ApiError('ISE', '서버 응답 형식이 올바르지 않습니다.');
    }

    return validation.data;
  });
