"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const viteReact = require("@vitejs/plugin-react");
const startPluginCore = require("@tanstack/start-plugin-core");
const schema = require("./schema.cjs");
function TanStackStartVitePlugin(opts) {
  const options = schema.getTanStackStartOptions(opts);
  if ((opts == null ? void 0 : opts.customViteReactPlugin) !== true) {
    console.warn(
      `please add the vite-react plugin to your Vite config and set 'customViteReactPlugin: true'`
    );
    console.warn(
      `TanStack Start will not configure the vite-react plugin in future anymore.`
    );
  }
  return [
    startPluginCore.TanStackStartVitePluginCore(
      {
        framework: "react",
        getVirtualServerRootHandler(ctx) {
          return `
import { toWebRequest, defineEventHandler } from '@tanstack/react-start/server';
import serverEntry from '${ctx.serverEntryFilepath}';

export default defineEventHandler(function(event) {
  const request = toWebRequest(event);
  return serverEntry({ request });
});`;
        },
        getVirtualClientEntry(ctx) {
          return `
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start';
import { createRouter } from '${ctx.routerFilepath}';

const router = createRouter();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient router={router} />
    </StrictMode>
  );
});`;
        },
        getVirtualServerEntry(ctx) {
          return `
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';
import { createRouter } from '${ctx.routerFilepath}';

export default createStartHandler({
  createRouter,
})(defaultStreamHandler);`;
        }
      },
      options
    ),
    !(opts == null ? void 0 : opts.customViteReactPlugin) && viteReact(options.react)
  ];
}
exports.TanStackStartVitePlugin = TanStackStartVitePlugin;
exports.tanstackStart = TanStackStartVitePlugin;
//# sourceMappingURL=index.cjs.map
