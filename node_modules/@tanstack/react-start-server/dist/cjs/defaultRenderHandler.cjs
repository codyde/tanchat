"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const server = require("@tanstack/react-router/ssr/server");
const StartServer = require("./StartServer.cjs");
const defaultRenderHandler = server.defineHandlerCallback(
  ({ router, responseHeaders }) => server.renderRouterToString({
    router,
    responseHeaders,
    children: /* @__PURE__ */ jsxRuntime.jsx(StartServer.StartServer, { router })
  })
);
exports.defaultRenderHandler = defaultRenderHandler;
//# sourceMappingURL=defaultRenderHandler.cjs.map
