import { z } from 'zod';

const clientEnvSchema = z.object({
  VITE_R2_PUBLIC_DOMAIN: z.url(),
  VITE_R2_RESIZING: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
