import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url(),
  DIRECT_URL: z.url(),
  REDIS_URL: z.url(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
