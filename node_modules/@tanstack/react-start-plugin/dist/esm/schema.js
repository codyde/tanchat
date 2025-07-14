import { z } from "zod";
import { createTanStackConfig, createTanStackStartOptionsSchema } from "@tanstack/start-plugin-core";
const frameworkPlugin = {
  react: z.custom().optional(),
  customViteReactPlugin: z.boolean().optional().default(false)
};
createTanStackStartOptionsSchema(frameworkPlugin);
const defaultConfig = createTanStackConfig(frameworkPlugin);
function getTanStackStartOptions(opts) {
  return defaultConfig.parse(opts);
}
export {
  getTanStackStartOptions
};
//# sourceMappingURL=schema.js.map
