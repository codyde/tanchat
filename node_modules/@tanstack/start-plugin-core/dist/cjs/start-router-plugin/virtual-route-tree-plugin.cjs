"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("node:path");
const vite = require("vite");
const startServerCore = require("@tanstack/start-server-core");
const debug = require("../debug.cjs");
function virtualRouteTreePlugin(config) {
  const generatedRouteTreePath = vite.normalizePath(
    path.resolve(config.generatedRouteTree)
  );
  return {
    name: "tanstack-start:virtual-route-tree",
    enforce: "pre",
    sharedDuringBuild: true,
    resolveId: {
      filter: { id: new RegExp(startServerCore.VIRTUAL_MODULES.routeTree) },
      handler(id) {
        let resolvedId = null;
        if (id === startServerCore.VIRTUAL_MODULES.routeTree) {
          if (debug.debug) console.info("resolving id", id, generatedRouteTreePath);
          resolvedId = generatedRouteTreePath;
        }
        return resolvedId;
      }
    }
  };
}
exports.virtualRouteTreePlugin = virtualRouteTreePlugin;
//# sourceMappingURL=virtual-route-tree-plugin.cjs.map
