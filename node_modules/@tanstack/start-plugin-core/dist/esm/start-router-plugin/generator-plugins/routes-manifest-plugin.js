import { rootRouteId } from "@tanstack/router-core";
function routesManifestPlugin() {
  return {
    name: "routes-manifest-plugin",
    onRouteTreesChanged: ({ routeTrees, rootRouteNode }) => {
      const routeTree = routeTrees.find((tree) => tree.exportName === "Route");
      if (!routeTree) {
        throw new Error(
          'No route tree found with export name "Route". Please ensure your routes are correctly defined.'
        );
      }
      const routesManifest = {
        [rootRouteId]: {
          filePath: rootRouteNode.fullPath,
          children: routeTree.acc.routeTree.map((d) => d.routePath)
        },
        ...Object.fromEntries(
          routeTree.acc.routeNodes.map((d) => {
            var _a, _b;
            const filePathId = d.routePath;
            return [
              filePathId,
              {
                filePath: d.fullPath,
                parent: ((_a = d.parent) == null ? void 0 : _a.routePath) ? d.parent.routePath : void 0,
                children: (_b = d.children) == null ? void 0 : _b.map((childRoute) => childRoute.routePath)
              }
            ];
          })
        )
      };
      globalThis.TSS_ROUTES_MANIFEST = { routes: routesManifest };
    }
  };
}
export {
  routesManifestPlugin
};
//# sourceMappingURL=routes-manifest-plugin.js.map
