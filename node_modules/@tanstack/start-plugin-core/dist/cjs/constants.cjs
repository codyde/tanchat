"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("node:path");
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
exports.CLIENT_DIST_DIR = CLIENT_DIST_DIR;
exports.SSR_ENTRY_FILE = SSR_ENTRY_FILE;
exports.VITE_ENVIRONMENT_NAMES = VITE_ENVIRONMENT_NAMES;
//# sourceMappingURL=constants.cjs.map
