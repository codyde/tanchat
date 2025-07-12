import path from "node:path";
import * as vite from "vite";
function resolveVirtualEntriesPlugin(opts, startConfig) {
  let resolvedConfig;
  const modules = /* @__PURE__ */ new Set([
    "/~start/server-entry",
    "/~start/default-server-entry",
    "/~start/default-client-entry"
  ]);
  return {
    name: "tanstack-start-core:resolve-virtual-entries",
    configResolved(config) {
      resolvedConfig = config;
    },
    resolveId: {
      filter: {
        id: new RegExp([...modules].join("|"))
      },
      handler(id) {
        if (modules.has(id)) {
          return `${id}.tsx`;
        }
        return void 0;
      }
    },
    load: {
      filter: {
        id: new RegExp([...modules].map((m) => `${m}.tsx`).join("|"))
      },
      handler(id) {
        const routerFilepath = vite.normalizePath(
          path.resolve(
            startConfig.root,
            startConfig.tsr.srcDirectory,
            "router"
          )
        );
        if (id === "/~start/server-entry.tsx") {
          const ssrEntryFilepath = startConfig.serverEntryPath.startsWith(
            "/~start/default-server-entry"
          ) ? startConfig.serverEntryPath : vite.normalizePath(
            path.resolve(resolvedConfig.root, startConfig.serverEntryPath)
          );
          return opts.getVirtualServerRootHandler({
            routerFilepath,
            serverEntryFilepath: ssrEntryFilepath
          });
        }
        if (id === "/~start/default-client-entry.tsx") {
          return opts.getVirtualClientEntry({ routerFilepath });
        }
        if (id === "/~start/default-server-entry.tsx") {
          return opts.getVirtualServerEntry({ routerFilepath });
        }
        return void 0;
      }
    }
  };
}
export {
  resolveVirtualEntriesPlugin
};
//# sourceMappingURL=plugin.js.map
