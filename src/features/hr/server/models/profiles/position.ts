import {
  ApiError,
  apiGet,
  clientResponseWithResult,
} from '@/common/api/configs';
import { ApiSuccessWithResult } from '@/common/api/schema';
import {
  PositionsResponseDto,
  positionsResponseSchema,
} from '@/features/hr/schema';

export const getPositions = async () =>
  clientResponseWithResult(async () => {
    const response = await apiGet<ApiSuccessWithResult<PositionsResponseDto>>(
      '/hr/positions',
      undefined,
      { authType: 'access' },
    );

    if (!response?.result) {
      throw new ApiError('ISE', '서버에서 응답이 없습니다.');
    }

    const validation = positionsResponseSchema.safeParse(response.result);

    if (!validation.success) {
      throw new ApiError('ISE', '서버 응답 형식이 올바르지 않습니다.');
    }

    return validation.data;
  });
