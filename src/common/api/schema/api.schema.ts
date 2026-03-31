import { z } from 'zod';
import { ResponseCode } from '@/common/api/constants';

const apiBaseSchema = z.object({
  code: z.enum(ResponseCode),
  message: z.string(),
});

const validationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const apiSuccessSchemaSchemaSingle = apiBaseSchema.extend({
  code: z.literal('SU'),
  message: z.literal('요청이 성공적으로 처리되었습니다.'),
});

export const apiSuccessSchemaWithResult = <T extends z.ZodTypeAny>(
  resultSchema: T,
) =>
  apiSuccessSchemaSchemaSingle.extend({
    result: resultSchema,
  });

export const apiFailSchema = apiBaseSchema.extend({
  code: z.enum(ResponseCode).exclude(['SUCCESS']),
  errors: z.array(validationErrorSchema).optional(),
});

export type ApiSuccessSingle = z.infer<typeof apiSuccessSchemaSchemaSingle>;

export type ApiSuccessWithResult<T> = z.infer<
  ReturnType<typeof apiSuccessSchemaWithResult<z.ZodType<T>>>
>;

export type ApiFail = z.infer<typeof apiFailSchema>;

export type ValidationError = z.infer<typeof validationErrorSchema>;

export type ClientResponseSingle = ApiSuccessSingle | ApiFail;

export type ClientResponseWithResult<T> = ApiSuccessWithResult<T> | ApiFail;
