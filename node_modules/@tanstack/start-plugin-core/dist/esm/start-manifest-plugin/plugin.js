import { joinURL } from "ufo";
import { rootRouteId } from "@tanstack/router-core";
import { VIRTUAL_MODULES } from "@tanstack/start-server-core";
import { tsrSplit } from "@tanstack/router-plugin";
import { resolveViteId } from "../utils.js";
const getCSSRecursively = (chunk, chunksByFileName, basePath) => {
  var _a;
  const result = [];
  for (const cssFile of ((_a = chunk.viteMetadata) == null ? void 0 : _a.importedCss) ?? []) {
    result.push({
      tag: "link",
      attrs: {
        rel: "stylesheet",
        href: joinURL(basePath, cssFile),
        type: "text/css"
      }
    });
  }
  for (const importedFileName of chunk.imports) {
    const importedChunk = chunksByFileName.get(importedFileName);
    if (importedChunk) {
      result.push(
        ...getCSSRecursively(importedChunk, chunksByFileName, basePath)
      );
    }
  }
  return result;
};
const resolvedModuleId = resolveViteId(VIRTUAL_MODULES.startManifest);
function startManifestPlugin(opts) {
  let config;
  return {
    name: "tanstack-start:start-manifest-plugin",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId: {
      filter: { id: new RegExp(VIRTUAL_MODULES.startManifest) },
      handler(id) {
        if (id === VIRTUAL_MODULES.startManifest) {
          return resolvedModuleId;
        }
        return void 0;
      }
    },
    load: {
      filter: {
        id: new RegExp(resolvedModuleId)
      },
      handler(id) {
        if (id === resolvedModuleId) {
          if (this.environment.config.consumer !== "server") {
            return `export default {}`;
          }
          const APP_BASE = globalThis.TSS_APP_BASE;
          if (config.command === "serve") {
            return `export const tsrStartManifest = () => ({
            routes: {},
            clientEntry: '${joinURL(APP_BASE, opts.clientEntry)}',
          })`;
          }
          const routeTreeRoutes = globalThis.TSS_ROUTES_MANIFEST.routes;
          let entryFile;
          const clientBundle = globalThis.TSS_CLIENT_BUNDLE;
          const chunksByFileName = /* @__PURE__ */ new Map();
          const routeChunks = {};
          for (const bundleEntry of Object.values(clientBundle)) {
            if (bundleEntry.type === "chunk") {
              chunksByFileName.set(bundleEntry.fileName, bundleEntry);
              if (bundleEntry.isEntry) {
                if (entryFile) {
                  throw new Error(
                    `multiple entries detected: ${entryFile.fileName} ${bundleEntry.fileName}`
                  );
                }
                entryFile = bundleEntry;
              }
              const routePieces = bundleEntry.moduleIds.flatMap((m) => {
                const [id2, query] = m.split("?");
                if (id2 === void 0) {
                  throw new Error("expected id to be defined");
                }
                if (query === void 0) {
                  return [];
                }
                const searchParams = new URLSearchParams(query);
                const split = searchParams.get(tsrSplit);
                if (split !== null) {
                  return {
                    id: id2,
                    split
                  };
                }
                return [];
              });
              if (routePieces.length > 0) {
                routePieces.forEach((r) => {
                  let array = routeChunks[r.id];
                  if (array === void 0) {
                    array = [];
                    routeChunks[r.id] = array;
                  }
                  array.push(bundleEntry);
                });
              }
            }
          }
          Object.entries(routeTreeRoutes).forEach(([routeId, v]) => {
            if (!v.filePath) {
              throw new Error(`expected filePath to be set for ${routeId}`);
            }
            const chunks = routeChunks[v.filePath];
            if (chunks) {
              chunks.forEach((chunk) => {
                const preloads = chunk.imports.map((d) => {
                  const assetPath = joinURL(APP_BASE, d);
                  return assetPath;
                });
                preloads.unshift(joinURL(APP_BASE, chunk.fileName));
                const cssAssetsList = getCSSRecursively(
                  chunk,
                  chunksByFileName,
                  APP_BASE
                );
                routeTreeRoutes[routeId] = {
                  ...v,
                  assets: [...v.assets || [], ...cssAssetsList],
                  preloads: [...v.preloads || [], ...preloads]
                };
              });
            }
          });
          if (!entryFile) {
            throw new Error("No entry file found");
          }
          routeTreeRoutes[rootRouteId].preloads = [
            joinURL(APP_BASE, entryFile.fileName),
            ...entryFile.imports.map((d) => joinURL(APP_BASE, d))
          ];
          const entryCssAssetsList = getCSSRecursively(
            entryFile,
            chunksByFileName,
            APP_BASE
          );
          routeTreeRoutes[rootRouteId].assets = [
            ...routeTreeRoutes[rootRouteId].assets || [],
            ...entryCssAssetsList
          ];
          const recurseRoute = (route, seenPreloads = {}) => {
            var _a;
            route.preloads = (_a = route.preloads) == null ? void 0 : _a.filter((preload) => {
              if (seenPreloads[preload]) {
                return false;
              }
              seenPreloads[preload] = true;
              return true;
            });
            if (route.children) {
              route.children.forEach((child) => {
                const childRoute = routeTreeRoutes[child];
                recurseRoute(childRoute, { ...seenPreloads });
              });
            }
          };
          recurseRoute(routeTreeRoutes[rootRouteId]);
          const routesManifest = {
            routes: routeTreeRoutes,
            clientEntry: joinURL(APP_BASE, entryFile.fileName)
          };
          return `export const tsrStartManifest = () => (${JSON.stringify(routesManifest)})`;
        }
        return void 0;
      }
    }
  };
}
export {
  getCSSRecursively,
  startManifestPlugin
};
//# sourceMappingURL=plugin.js.map
