import { z } from 'zod';

export const zNumberToString = z
  .number()
  .transform((val: number) => val.toString());

export const zStringToNumber = z
  .string()
  .transform((val: string) => Number(val));

export const zBigIntToString = z
  .bigint()
  .transform((val: bigint) => val.toString());

export const zStringToBigInt = z
  .string()
  .transform((val: string) => BigInt(val));

export const zStringToDate = z.iso
  .datetime()
  .transform((val: string) => new Date(val));
