import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(process.env.NODE_ENV === 'test' ? 'test' : mode, process.cwd(), '');

  for (const key in env) {
    if (key.startsWith('VITE_')) {
      process.env[key] = env[key];
    }
  }

  const isLadle = process.env.LADLE === 'true' || process.argv.some((arg) => arg.includes('ladle'));

  return {
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      !isLadle && tanstackStart(),
      !isLadle && viteReact(),
      !isLadle &&
        babel({
          include: /\.(js|jsx|ts|tsx)$/,
          presets: [reactCompilerPreset()],
        }),
    ].filter(Boolean),
  };
});
