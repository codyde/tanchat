"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vite = require("@tanstack/router-plugin/vite");
const constants = require("../constants.cjs");
const routeTreeClientPlugin = require("./route-tree-client-plugin.cjs");
const virtualRouteTreePlugin = require("./virtual-route-tree-plugin.cjs");
const routesManifestPlugin = require("./generator-plugins/routes-manifest-plugin.cjs");
const serverRoutesPlugin = require("./generator-plugins/server-routes-plugin.cjs");
function tanStackStartRouter(config) {
  return [
    vite.tanstackRouterGenerator({
      ...config,
      plugins: [serverRoutesPlugin.serverRoutesPlugin(), routesManifestPlugin.routesManifestPlugin()],
      plugin: {
        vite: { environmentName: constants.VITE_ENVIRONMENT_NAMES.client }
      }
    }),
    vite.tanStackRouterCodeSplitter({
      ...config,
      codeSplittingOptions: {
        ...config.codeSplittingOptions,
        deleteNodes: ["ssr"],
        addHmr: true
      },
      plugin: {
        vite: { environmentName: constants.VITE_ENVIRONMENT_NAMES.client }
      }
    }),
    vite.tanStackRouterCodeSplitter({
      ...config,
      codeSplittingOptions: {
        ...config.codeSplittingOptions,
        addHmr: false
      },
      plugin: {
        vite: { environmentName: constants.VITE_ENVIRONMENT_NAMES.server }
      }
    }),
    vite.tanstackRouterAutoImport(config),
    routeTreeClientPlugin.routeTreeClientPlugin(config),
    virtualRouteTreePlugin.virtualRouteTreePlugin(config)
  ];
}
exports.tanStackStartRouter = tanStackStartRouter;
//# sourceMappingURL=plugin.cjs.map
