import { rootRouteId } from "@tanstack/router-core";
import { VIRTUAL_MODULES } from "./virtual-modules.js";
import { loadVirtualModule } from "./loadVirtualModule.js";
async function getStartManifest(opts) {
  const { tsrStartManifest } = await loadVirtualModule(
    VIRTUAL_MODULES.startManifest
  );
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
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
export {
  getStartManifest
};
//# sourceMappingURL=router-manifest.js.map
