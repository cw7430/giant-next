import { z } from 'zod';

export const refreshRequestSchema = z.object({
  isAuto: z.boolean(),
});

export const meResponseSchema = z.object({
  isAuthenticated: z.boolean(),
});

export type RefreshRequestDto = z.infer<typeof refreshRequestSchema>;

export type MeResponseDto = z.infer<typeof meResponseSchema>;
