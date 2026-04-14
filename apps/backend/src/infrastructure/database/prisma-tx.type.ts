import type { PrismaClient } from '@prisma/client';

/** Prisma client passed to interactive `$transaction` callbacks (subset of PrismaClient). */
export type PrismaTransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
