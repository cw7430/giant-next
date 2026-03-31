import {
  ClientResponseSingle,
  ClientResponseWithResult,
  ValidationError,
} from '@/common/api/schema';
import type { ResponseCode } from '@/common/api/constants';
import { ApiError } from './api-error';

const successSingle = (): ClientResponseSingle => ({
  code: 'SU',
  message: '요청이 성공적으로 처리되었습니다.',
});

const successWithResult = <T>(result: T): ClientResponseWithResult<T> => ({
  code: 'SU',
  message: '요청이 성공적으로 처리되었습니다.',
  result,
});

const fail = (
  code: Exclude<ResponseCode, 'SU'>,
  message: string,
  errors?: ValidationError[],
): ClientResponseWithResult<never> => ({
  code,
  message,
  errors,
});

export const clientResponseSingle = (
  fn: () => Promise<void>,
): Promise<ClientResponseSingle> =>
  (async () => {
    try {
      await fn();
      return successSingle();
    } catch (e) {
      if (e instanceof ApiError) {
        return fail(e.code, e.message, e.errors);
      }
      throw e;
    }
  })();

export const clientResponseWithResult = <T>(
  fn: () => Promise<T>,
): Promise<ClientResponseWithResult<T>> =>
  (async () => {
    try {
      const result = await fn();
      return successWithResult(result);
    } catch (e) {
      if (e instanceof ApiError) {
        return fail(e.code, e.message, e.errors);
      }
      throw e;
    }
  })();
