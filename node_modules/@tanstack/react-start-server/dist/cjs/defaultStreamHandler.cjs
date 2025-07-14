"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const server = require("@tanstack/react-router/ssr/server");
const StartServer = require("./StartServer.cjs");
const defaultStreamHandler = server.defineHandlerCallback(
  ({ request, router, responseHeaders }) => server.renderRouterToStream({
    request,
    router,
    responseHeaders,
    children: /* @__PURE__ */ jsxRuntime.jsx(StartServer.StartServer, { router })
  })
);
exports.defaultStreamHandler = defaultStreamHandler;
//# sourceMappingURL=defaultStreamHandler.cjs.map
