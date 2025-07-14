import path from "node:path";
const VITE_ENVIRONMENT_NAMES = {
  // 'ssr' is chosen as the name for the server environment to ensure backwards compatibility
  // with vite plugins that are not compatible with the new vite environment API (e.g. tailwindcss)
  server: "ssr",
  client: "client"
};
const CLIENT_DIST_DIR = path.join(
  ".tanstack",
  "start",
  "build",
  "client-dist"
);
const SSR_ENTRY_FILE = "ssr.mjs";
export {
  CLIENT_DIST_DIR,
  SSR_ENTRY_FILE,
  VITE_ENVIRONMENT_NAMES
};
//# sourceMappingURL=constants.js.map
