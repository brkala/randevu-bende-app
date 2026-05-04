import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { serverEnv } from '@/features/shared/lib/server-env.server';

const connectionString =
  serverEnv.NODE_ENV === 'test' ? serverEnv.TEST_DATABASE_URL : serverEnv.DATABASE_URL;

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});
