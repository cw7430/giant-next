import { z } from 'zod';

import { zStringToBigInt } from '@/common/utils';

const positionResponseSchema = z.object({
  positionId: z.string(),
  positionCode: z.string(),
  positionName: z.string(),
  basicSalary: zStringToBigInt,
  incentiveSalary: zStringToBigInt,
});

export const positionsResponseSchema = z.array(positionResponseSchema)

export type PositionsResponseDto = z.infer<typeof positionsResponseSchema>;
