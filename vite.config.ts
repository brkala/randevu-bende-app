import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { config } from 'dotenv';
import { defineConfig } from 'vite';

// Load .env only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  config();
}

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': '/src',
    },
  },
  plugins: [
    tanstackStart(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
});
