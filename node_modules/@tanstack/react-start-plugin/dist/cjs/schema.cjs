"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const zod = require("zod");
const startPluginCore = require("@tanstack/start-plugin-core");
const frameworkPlugin = {
  react: zod.z.custom().optional(),
  customViteReactPlugin: zod.z.boolean().optional().default(false)
};
startPluginCore.createTanStackStartOptionsSchema(frameworkPlugin);
const defaultConfig = startPluginCore.createTanStackConfig(frameworkPlugin);
function getTanStackStartOptions(opts) {
  return defaultConfig.parse(opts);
}
exports.getTanStackStartOptions = getTanStackStartOptions;
//# sourceMappingURL=schema.cjs.map
