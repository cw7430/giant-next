import { z } from 'zod';

import { zStringToBigInt } from '@/common/utils';

export const positionResponseSchema = z.object({
  positionId: z.string(),
  positionCode: z.string(),
  positionName: z.string(),
  basicSalary: zStringToBigInt,
  incentiveSalary: zStringToBigInt,
});

export type PositionResponseDto = z.infer<typeof positionResponseSchema>;
