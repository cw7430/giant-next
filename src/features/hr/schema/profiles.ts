import { z } from 'zod';

import { pageRequestSchema, pageResponseSchema } from '@/common/api/schema';

export const employeeProfileListRequestSchema = pageRequestSchema([
  'employee',
  'position',
  'department',
] as const);

export const createEmployeeProfileSchema = z.object({
  employeeCode: z.string().min(1, '사번을 생성해주세요.'),
  employeeName: z.string().min(1, '사원 이름을 입력해주세요.'),
  positionCode: z.string().regex(/^PSN\d{2,3}$/, '직급을 선택해주세요.'),
  employeeRole: z.enum(
    ['DEPARTMENT_CHIEF', 'TEAM_CHIEF', 'EMPLOYEE'],
    '직책을 선택해주세요.',
  ),
  teamCode: z.string().regex(/^TM\d{3}$/, '부서와 팀을 선택해주세요.'),
  phoneNumber: z
    .string()
    .min(1, '휴대전화 번호를 입력해주세요.')
    .regex(
      /^(010|011|016|017|018|019)-\d{3,4}-\d{4}$/,
      '전화번호 형식이 올바르지 않습니다.',
    ),
  email: z
    .string()
    .min(1, '이메일 입력해주세요.')
    .pipe(z.email('이메일 형식이 올바르지 않습니다.')),
});

export const updateEmployeeProfileSchema = z.object({
  positionCode: z.string().nullable(),
  teamCode: z.string().nullable(),
  employeeRole: z
    .enum(['DEPARTMENT_CHIEF', 'TEAM_CHIEF', 'EMPLOYEE', 'LEFT'])
    .nullable(),
});

export const employeeCodeResponseSchema = z.object({
  employeeCode: z.string(),
});

export const employeeProfileResponseSchema = employeeCodeResponseSchema.extend({
  employeeId: z.string(),
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

export type EmployeeProfileListRequestDto = z.infer<
  typeof employeeProfileListRequestSchema
>;

export type CreateEmployeeProfileRequestDto = z.infer<
  typeof createEmployeeProfileSchema
>;

export type UpdateEmployeeProfileRequestDto = z.infer<
  typeof updateEmployeeProfileSchema
>;

export type EmployeeCodeResponseDto = z.infer<
  typeof employeeCodeResponseSchema
>;

export type EmployeeProfileResponseDto = z.infer<
  typeof employeeProfileResponseSchema
>;

export type EmployeeProfileListResponseDto = z.infer<
  typeof employeeProfileListResponseSchema
>;
