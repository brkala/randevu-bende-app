import { z } from 'zod';

const clientEnvSchema = z.unknown();

export const clientEnv = clientEnvSchema.parse(import.meta.env);
