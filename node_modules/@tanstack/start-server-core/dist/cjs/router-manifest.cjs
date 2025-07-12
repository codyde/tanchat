"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const routerCore = require("@tanstack/router-core");
const virtualModules = require("./virtual-modules.cjs");
const loadVirtualModule = require("./loadVirtualModule.cjs");
async function getStartManifest(opts) {
  const { tsrStartManifest } = await loadVirtualModule.loadVirtualModule(
    virtualModules.VIRTUAL_MODULES.startManifest
  );
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[routerCore.rootRouteId] = startManifest.routes[routerCore.rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  if (process.env.NODE_ENV === "development") {
    if (globalThis.TSS_INJECTED_HEAD_SCRIPTS) {
      script = `${globalThis.TSS_INJECTED_HEAD_SCRIPTS + ";"}${script}`;
    }
  }
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      suppressHydrationWarning: true,
      async: true
    },
    children: script
  });
  const manifest = {
    ...startManifest,
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).map(([k, v]) => {
        const { preloads, assets } = v;
        return [
          k,
          {
            preloads,
            assets
          }
        ];
      })
    )
  };
  return manifest;
}
exports.getStartManifest = getStartManifest;
//# sourceMappingURL=router-manifest.cjs.map
