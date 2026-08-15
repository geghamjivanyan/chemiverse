import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Dev: фронт на :5173, /api проксируется на сервер :3000.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // воркер рук — классический (iife, по умолчанию): MediaPipe wasm-загрузчику
  // нужен importScripts, недоступный в module-воркерах («ModuleFactory not set»)
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
