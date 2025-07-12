"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vite = require("vite");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const vite__namespace = /* @__PURE__ */ _interopNamespaceDefault(vite);
function loadEnvPlugin(startOpts) {
  return {
    name: "tanstack-vite-plugin-nitro-load-env",
    enforce: "pre",
    config(userConfig, envConfig) {
      Object.assign(
        process.env,
        vite__namespace.loadEnv(envConfig.mode, userConfig.root ?? startOpts.root, "")
      );
    }
  };
}
exports.loadEnvPlugin = loadEnvPlugin;
//# sourceMappingURL=plugin.cjs.map
