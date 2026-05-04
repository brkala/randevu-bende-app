import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { serverEnv } from '@/features/shared/lib/server-env.server';

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: serverEnv.DATABASE_URL,
  }),
});
