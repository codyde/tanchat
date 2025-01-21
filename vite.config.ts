import { defineConfig } from 'vite';
// import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    // tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['better-sqlite3']
  },
  build: {
    rollupOptions: {
      external: ['better-sqlite3']
    }
  }
});
