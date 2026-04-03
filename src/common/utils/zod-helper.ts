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
