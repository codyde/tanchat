// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
var vite_config_default = defineConfig({
  server: {
    port: 3e3
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart()
  ],
  optimizeDeps: {
    exclude: ["better-sqlite3"]
  },
  build: {
    rollupOptions: {
      external: ["better-sqlite3"]
    }
  }
});
export {
  vite_config_default as default
};
