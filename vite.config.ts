import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    tanstackStart({
      customViteReactPlugin: true
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    hmr: {
      overlay: false
    }
  },
  optimizeDeps: {
    exclude: ['better-sqlite3']
  },
  build: {
    rollupOptions: {
      external: ['better-sqlite3']
    }
  }
});
