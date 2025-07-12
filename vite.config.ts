import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: { 
    port: 3000 
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart({
      customViteReactPlugin: true
    }),
    react()
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
