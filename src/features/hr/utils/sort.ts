import { PositionsResponseDto } from '@/features/hr/schema';

export const sortPositionsDesc = (positions: PositionsResponseDto) => {
  return [...positions].sort(
    (a, b) => Number(b.positionId) - Number(a.positionId),
  );
};
