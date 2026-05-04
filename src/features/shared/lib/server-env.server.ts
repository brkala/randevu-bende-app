import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url(),
  TEST_DATABASE_URL: z.url().optional(),
  TEST_DIRECT_URL: z.url().optional(),
  REDIS_URL: z.url(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
