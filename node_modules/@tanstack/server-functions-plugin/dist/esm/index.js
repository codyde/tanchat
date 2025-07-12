import { TanStackDirectiveFunctionsPlugin, TanStackDirectiveFunctionsPluginEnv } from "@tanstack/directive-functions-plugin";
const debug = process.env.TSR_VITE_DEBUG && ["true", "server-functions-plugin"].includes(process.env.TSR_VITE_DEBUG);
function createTanStackServerFnPlugin(opts) {
  const directiveFnsById = {};
  let viteDevServer;
  const onDirectiveFnsById = buildOnDirectiveFnsByIdCallback({
    directiveFnsById,
    manifestVirtualImportId: opts.manifestVirtualImportId,
    invalidateModule: (id) => {
      if (viteDevServer) {
        const mod = viteDevServer.moduleGraph.getModuleById(id);
        if (mod) {
          if (debug) {
            console.info(`invalidating module ${JSON.stringify(mod.id)}`);
          }
          viteDevServer.moduleGraph.invalidateModule(mod);
        }
      }
    }
  });
  const directive = "use server";
  const directiveLabel = "Server Function";
  return {
    client: [
      // The client plugin is used to compile the client directives
      // and save them so we can create a manifest
      TanStackDirectiveFunctionsPlugin({
        envLabel: "Client",
        directive,
        directiveLabel,
        getRuntimeCode: opts.client.getRuntimeCode,
        replacer: opts.client.replacer,
        onDirectiveFnsById
      })
    ],
    ssr: [
      // The SSR plugin is used to compile the server directives
      TanStackDirectiveFunctionsPlugin({
        envLabel: "SSR",
        directive,
        directiveLabel,
        getRuntimeCode: opts.ssr.getRuntimeCode,
        replacer: opts.ssr.replacer,
        onDirectiveFnsById
      })
    ],
    server: [
      {
        // On the server, we need to be able to read the server-function manifest from the client build.
        // This is likely used in the handler for server functions, so we can find the server function
        // by its ID, import it, and call it.
        name: "tanstack-start-server-fn-vite-plugin-manifest-server",
        enforce: "pre",
        configureServer(server) {
          viteDevServer = server;
        },
        resolveId(id) {
          if (id === opts.manifestVirtualImportId) {
            return resolveViteId(id);
          }
          return void 0;
        },
        load(id) {
          if (id !== resolveViteId(opts.manifestVirtualImportId)) {
            return void 0;
          }
          const manifestWithImports = `
          export default {${Object.entries(directiveFnsById).map(
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
      TanStackDirectiveFunctionsPlugin({
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
function TanStackServerFnPluginEnv(_opts) {
  const opts = {
    ..._opts,
    client: {
      ..._opts.client,
      envName: _opts.client.envName || "client"
    },
    server: {
      ..._opts.server,
      envName: _opts.server.envName || "server"
    }
  };
  const directiveFnsById = {};
  let serverDevEnv;
  const onDirectiveFnsById = buildOnDirectiveFnsByIdCallback({
    directiveFnsById,
    manifestVirtualImportId: opts.manifestVirtualImportId,
    invalidateModule: (id) => {
      if (serverDevEnv) {
        const mod = serverDevEnv.moduleGraph.getModuleById(id);
        if (mod) {
          if (debug) {
            console.info(
              `invalidating module ${JSON.stringify(mod.id)} in server environment`
            );
          }
          serverDevEnv.moduleGraph.invalidateModule(mod);
        }
      }
    }
  });
  const directive = "use server";
  const directiveLabel = "Server Function";
  return [
    // The client plugin is used to compile the client directives
    // and save them so we can create a manifest
    TanStackDirectiveFunctionsPluginEnv({
      directive,
      directiveLabel,
      onDirectiveFnsById,
      environments: {
        client: {
          envLabel: "Client",
          getRuntimeCode: opts.client.getRuntimeCode,
          replacer: opts.client.replacer,
          envName: opts.client.envName
        },
        server: {
          envLabel: "Server",
          getRuntimeCode: opts.server.getRuntimeCode,
          replacer: opts.server.replacer,
          envName: opts.server.envName
        }
      }
    }),
    {
      // On the server, we need to be able to read the server-function manifest from the client build.
      // This is likely used in the handler for server functions, so we can find the server function
      // by its ID, import it, and call it.
      name: "tanstack-start-server-fn-vite-plugin-manifest-server",
      enforce: "pre",
      configureServer(viteDevServer) {
        serverDevEnv = viteDevServer.environments[opts.server.envName];
        if (!serverDevEnv) {
          throw new Error(
            `TanStackServerFnPluginEnv: environment "${opts.server.envName}" not found`
          );
        }
      },
      resolveId: {
        filter: { id: new RegExp(opts.manifestVirtualImportId) },
        handler(id) {
          return resolveViteId(id);
        }
      },
      load: {
        filter: { id: new RegExp(resolveViteId(opts.manifestVirtualImportId)) },
        handler() {
          if (this.environment.name !== opts.server.envName) {
            return `export default {}`;
          }
          const manifestWithImports = `
          export default {${Object.entries(directiveFnsById).map(
            ([id, fn]) => `'${id}': {
                  functionName: '${fn.functionName}',
                  importer: () => import(${JSON.stringify(fn.extractedFilename)})
                }`
          ).join(",")}}`;
          return manifestWithImports;
        }
      }
    }
  ];
}
function resolveViteId(id) {
  return `\0${id}`;
}
function buildOnDirectiveFnsByIdCallback(opts) {
  const onDirectiveFnsById = (d) => {
    if (debug) {
      console.info(`onDirectiveFnsById received: `, d);
    }
    const newKeys = Object.keys(d).filter(
      (key) => !(key in opts.directiveFnsById)
    );
    if (newKeys.length > 0) {
      Object.assign(opts.directiveFnsById, d);
      if (debug) {
        console.info(`directiveFnsById after update: `, opts.directiveFnsById);
      }
      opts.invalidateModule(resolveViteId(opts.manifestVirtualImportId));
    }
  };
  return onDirectiveFnsById;
}
export {
  TanStackServerFnPluginEnv,
  createTanStackServerFnPlugin
};
//# sourceMappingURL=index.js.map
