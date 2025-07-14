import { VIRTUAL_MODULES } from "./virtual-modules.js";
async function loadVirtualModule(id) {
  switch (id) {
    case VIRTUAL_MODULES.routeTree:
      return await import("tanstack-start-route-tree:v");
    case VIRTUAL_MODULES.startManifest:
      return await import("tanstack-start-manifest:v");
    case VIRTUAL_MODULES.serverFnManifest:
      return await import("tanstack-start-server-fn-manifest:v");
    default:
      throw new Error(`Unknown virtual module: ${id}`);
  }
}
export {
  loadVirtualModule
};
//# sourceMappingURL=loadVirtualModule.js.map
