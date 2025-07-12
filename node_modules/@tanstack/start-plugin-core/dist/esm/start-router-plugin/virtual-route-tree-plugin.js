import path from "node:path";
import { normalizePath } from "vite";
import { VIRTUAL_MODULES } from "@tanstack/start-server-core";
import { debug } from "../debug.js";
function virtualRouteTreePlugin(config) {
  const generatedRouteTreePath = normalizePath(
    path.resolve(config.generatedRouteTree)
  );
  return {
    name: "tanstack-start:virtual-route-tree",
    enforce: "pre",
    sharedDuringBuild: true,
    resolveId: {
      filter: { id: new RegExp(VIRTUAL_MODULES.routeTree) },
      handler(id) {
        let resolvedId = null;
        if (id === VIRTUAL_MODULES.routeTree) {
          if (debug) console.info("resolving id", id, generatedRouteTreePath);
          resolvedId = generatedRouteTreePath;
        }
        return resolvedId;
      }
    }
  };
}
export {
  virtualRouteTreePlugin
};
//# sourceMappingURL=virtual-route-tree-plugin.js.map
