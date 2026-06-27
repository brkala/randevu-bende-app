import { defineConfig } from 'prisma/config';
import { serverEnv } from '../../shared/lib/server-env.server';
import '../../shared/lib/env-loader.server';

// biome-ignore lint/style/noDefaultExport: Prisma config requires a default export
export default defineConfig({
  schema: 'src/features/database/models',
  migrations: {
    path: 'src/features/database/migrations',
    seed: 'tsx src/features/database/seeds/seed.ts',
  },
  datasource: {
    url: serverEnv.DIRECT_URL,
  },
});
