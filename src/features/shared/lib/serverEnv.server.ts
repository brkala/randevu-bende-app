import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
});

export const serverEnv = serverEnvSchema.parse(process.env);
