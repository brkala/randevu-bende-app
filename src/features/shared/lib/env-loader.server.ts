import { config } from 'dotenv';

export function loadEnv() {
  // biome-ignore lint/style/noProcessEnv: This is the entry point for environment loading
  const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
  config({ path: envFile, override: true, quiet: true });
}

// Modül import edildiğinde otomatik yükleme yapar
loadEnv();
