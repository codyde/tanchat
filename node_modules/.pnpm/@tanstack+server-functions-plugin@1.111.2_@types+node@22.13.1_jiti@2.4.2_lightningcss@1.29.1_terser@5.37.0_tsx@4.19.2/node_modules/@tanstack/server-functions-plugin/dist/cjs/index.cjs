"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_fs = require("node:fs");
const path = require("node:path");
const directiveFunctionsPlugin = require("@tanstack/directive-functions-plugin");
function createTanStackServerFnPlugin(opts) {
  const ROOT = process.cwd();
  const manifestFilename = "node_modules/.tanstack-start/server-functions-manifest.json";
  globalThis.TSR_directiveFnsById = {};
  const onDirectiveFnsById = (d) => {
    Object.assign(
      globalThis.TSR_directiveFnsById,
      Object.fromEntries(
        Object.entries(d).map(([id, fn]) => [
          id,
          {
            ...fn,
            // This importer is required for the development server to
            // work. It's also required in production, but cannot be serialized
            // into the manifest because it's a dynamic import. Instead, as you'll
            // see below, we augment the manifest output with a code-generated importer
            // that looks exactly like this.
            importer: () => import(fn.extractedFilename)
          }
        ])
      )
    );
  };
  const directive = "use server";
  const directiveLabel = "Server Function";
  return {
    client: [
      // The client plugin is used to compile the client directives
      // and save them so we can create a manifest
      directiveFunctionsPlugin.TanStackDirectiveFunctionsPlugin({
        envLabel: "Client",
        directive,
        directiveLabel,
        getRuntimeCode: opts.client.getRuntimeCode,
        replacer: opts.client.replacer,
        onDirectiveFnsById
        // devSplitImporter: `(globalThis.app.getRouter('server').internals.devServer.ssrLoadModule)`,
      }),
      {
        // Now that we have the directiveFnsById, we need to create a new
        // virtual module that can be used to import that manifest
        name: "tanstack-start-server-fn-vite-plugin-build-client",
        generateBundle() {
          node_fs.mkdirSync(path.dirname(manifestFilename), { recursive: true });
          node_fs.writeFileSync(
            path.join(ROOT, manifestFilename),
            JSON.stringify(
              Object.fromEntries(
                Object.entries(globalThis.TSR_directiveFnsById).map(
                  ([id, fn]) => [
                    id,
                    {
                      functionName: fn.functionName,
                      extractedFilename: fn.extractedFilename
                    }
                  ]
                )
              )
            )
          );
        }
      }
    ],
    ssr: [
      // The SSR plugin is used to compile the server directives
      directiveFunctionsPlugin.TanStackDirectiveFunctionsPlugin({
        envLabel: "SSR",
        directive,
        directiveLabel,
        getRuntimeCode: opts.ssr.getRuntimeCode,
        replacer: opts.ssr.replacer,
        onDirectiveFnsById
        // devSplitImporter: `(globalThis.app.getRouter('server').internals.devServer.ssrLoadModule)`,
      })
    ],
    server: [
      {
        // On the server, we need to be able to read the server-function manifest from the client build.
        // This is likely used in the handler for server functions, so we can find the server function
        // by its ID, import it, and call it. We can't do this in memory here because the builds happen in isolation,
        // so the manifest is like a serialized state from the client build to the server build
        name: "tanstack-start-server-fn-vite-plugin-manifest-server",
        enforce: "pre",
        resolveId: (id) => id === opts.manifestVirtualImportId ? id : null,
        load(id) {
          if (id !== opts.manifestVirtualImportId) return null;
          if (process.env.NODE_ENV === "development") {
            return `export default globalThis.TSR_directiveFnsById`;
          }
          const manifest = JSON.parse(
            node_fs.readFileSync(path.join(ROOT, manifestFilename), "utf-8")
          );
          const manifestWithImports = `
          export default {${Object.entries(manifest).map(
            ([id2, fn]) => `'${id2}': {
                  functionName: '${fn.functionName}',
                  importer: () => import(${JSON.stringify(fn.extractedFilename)})
                }`
          ).join(",")}}`;
          return manifestWithImports;
        }
      },
      // On the server, we need to compile the server functions
      // so they can be called by other server functions.
      // This is also where we split the server function into a separate file
      // so we can load them on demand in the worker.
      directiveFunctionsPlugin.TanStackDirectiveFunctionsPlugin({
        envLabel: "Server",
        directive,
        directiveLabel,
        getRuntimeCode: opts.server.getRuntimeCode,
        replacer: opts.server.replacer,
        onDirectiveFnsById
      })
    ]
  };
}
exports.createTanStackServerFnPlugin = createTanStackServerFnPlugin;
//# sourceMappingURL=index.cjs.map
