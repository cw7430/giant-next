import { z } from 'zod';

const teamResponseSchema = z.object({
  teamId: z.string(),
  teamCode: z.string(),
  teamName: z.string(),
});

const departmentResponseSchema = z.object({
  departmentId: z.string(),
  departmentCode: z.string(),
  departmentName: z.string(),
  teams: z.array(teamResponseSchema),
});

export const departmentsResponseSchema = z.array(departmentResponseSchema)

export type DepartmentsResponseDto = z.infer<typeof departmentsResponseSchema>;
