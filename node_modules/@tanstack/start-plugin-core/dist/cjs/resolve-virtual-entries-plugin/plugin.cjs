"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("node:path");
const vite = require("vite");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const vite__namespace = /* @__PURE__ */ _interopNamespaceDefault(vite);
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
        const routerFilepath = vite__namespace.normalizePath(
          path.resolve(
            startConfig.root,
            startConfig.tsr.srcDirectory,
            "router"
          )
        );
        if (id === "/~start/server-entry.tsx") {
          const ssrEntryFilepath = startConfig.serverEntryPath.startsWith(
            "/~start/default-server-entry"
          ) ? startConfig.serverEntryPath : vite__namespace.normalizePath(
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
exports.resolveVirtualEntriesPlugin = resolveVirtualEntriesPlugin;
//# sourceMappingURL=plugin.cjs.map
