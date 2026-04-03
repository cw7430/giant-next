import { z } from 'zod';

import { pageRequestSchema, pageResponseSchema } from '@/common/api/schema';

export const employeeProfileListRequestSchema = pageRequestSchema([
  'employee',
  'position',
  'department',
] as const);

export const employeeProfileResponseSchema = z.object({
  employeeId: z.string(),
  employeeCode: z.string(),
  employeeRole: z.enum(['DEPARTMENT_CHIEF', 'TEAM_CHIEF', 'EMPLOYEE', 'LEFT']),
  employeeName: z.string(),
  positionCode: z.string(),
  positionName: z.string(),
  departmentCode: z.string(),
  departmentName: z.string(),
  teamCode: z.string(),
  teamName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  createdBy: z.string().nullable(),
  createdEmployeeName: z.string().nullable(),
  updatedBy: z.string().nullable(),
  updatedEmployeeName: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  leftAt: z.coerce.date().nullable(),
});

export const employeeProfileListResponseSchema = pageResponseSchema(
  employeeProfileResponseSchema,
);

export type EmployeeProfileResponseDto = z.infer<
  typeof employeeProfileResponseSchema
>;

export type EmployeeProfileListRequestDto = z.infer<
  typeof employeeProfileListRequestSchema
>;

export type EmployeeProfileListResponseDto = z.infer<
  typeof employeeProfileListResponseSchema
>;