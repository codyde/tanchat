import { tanstackRouterGenerator, tanStackRouterCodeSplitter, tanstackRouterAutoImport } from "@tanstack/router-plugin/vite";
import { VITE_ENVIRONMENT_NAMES } from "../constants.js";
import { routeTreeClientPlugin } from "./route-tree-client-plugin.js";
import { virtualRouteTreePlugin } from "./virtual-route-tree-plugin.js";
import { routesManifestPlugin } from "./generator-plugins/routes-manifest-plugin.js";
import { serverRoutesPlugin } from "./generator-plugins/server-routes-plugin.js";
function tanStackStartRouter(config) {
  return [
    tanstackRouterGenerator({
      ...config,
      plugins: [serverRoutesPlugin(), routesManifestPlugin()],
      plugin: {
        vite: { environmentName: VITE_ENVIRONMENT_NAMES.client }
      }
    }),
    tanStackRouterCodeSplitter({
      ...config,
      codeSplittingOptions: {
        ...config.codeSplittingOptions,
        deleteNodes: ["ssr"],
        addHmr: true
      },
      plugin: {
        vite: { environmentName: VITE_ENVIRONMENT_NAMES.client }
      }
    }),
    tanStackRouterCodeSplitter({
      ...config,
      codeSplittingOptions: {
        ...config.codeSplittingOptions,
        addHmr: false
      },
      plugin: {
        vite: { environmentName: VITE_ENVIRONMENT_NAMES.server }
      }
    }),
    tanstackRouterAutoImport(config),
    routeTreeClientPlugin(config),
    virtualRouteTreePlugin(config)
  ];
}
export {
  tanStackStartRouter
};
//# sourceMappingURL=plugin.js.map
