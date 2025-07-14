import * as vite from "vite";
function loadEnvPlugin(startOpts) {
  return {
    name: "tanstack-vite-plugin-nitro-load-env",
    enforce: "pre",
    config(userConfig, envConfig) {
      Object.assign(
        process.env,
        vite.loadEnv(envConfig.mode, userConfig.root ?? startOpts.root, "")
      );
    }
  };
}
export {
  loadEnvPlugin
};
//# sourceMappingURL=plugin.js.map
