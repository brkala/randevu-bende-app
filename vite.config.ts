import babel from '@rolldown/plugin-babel';
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

  return {
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    plugins: [
      tanstackStart(),
      viteReact(),
      babel({
        include: /\.(js|jsx|ts|tsx)$/,
        presets: [reactCompilerPreset()],
      }),
    ],
  };
});
