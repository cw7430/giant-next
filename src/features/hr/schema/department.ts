import { z } from 'zod';

const teamResponseSchema = z.object({
  teamId: z.string(),
  teamCode: z.string(),
  teamName: z.string(),
});

export const departmentResponseSchema = z.object({
  departmentId: z.string(),
  departmentCode: z.string(),
  departmentame: z.string(),
  teams: z.array(teamResponseSchema),
});

export type DepartmentResponseDto = z.infer<typeof departmentResponseSchema>;
