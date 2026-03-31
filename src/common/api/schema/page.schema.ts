import { z } from 'zod';

export const pageRequestSchema = <T extends [string, ...string[]]>(
  sortPath: T,
) =>
  z.object({
    page: z.number(),
    size: z.number(),
    blockSize: z.number(),
    sortPath: z.enum(sortPath),
    sortOrder: z.enum(['asc', 'desc']),
  });

export const pageResponseMetaSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  size: z.number(),
  startPage: z.number(),
  endPage: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const pageResponseSchema = <T extends z.ZodTypeAny>(content: T) =>
  pageResponseMetaSchema.extend({
    content: z.array(content),
  });

export type PageResponseMetaDto = z.infer<typeof pageResponseMetaSchema>;
