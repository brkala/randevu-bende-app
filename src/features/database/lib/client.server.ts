import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { serverEnv } from '@/features/shared/lib/server-env.server';
import { softDeleteExtension } from './extensions/soft-delete.extension';
import { tenantExtension } from './extensions/tenant.extension';
import { uuidExtension } from './extensions/uuid.extension';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: serverEnv.DATABASE_URL,
  }),
})
  .$extends(softDeleteExtension)
  .$extends(uuidExtension);

export type ExtendedPrismaClient = typeof prisma;

export function getTenantDb(shopId: string) {
  return prisma.$extends(tenantExtension(shopId));
}
