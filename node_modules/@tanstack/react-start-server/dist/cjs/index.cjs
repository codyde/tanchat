"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const StartServer = require("./StartServer.cjs");
const defaultStreamHandler = require("./defaultStreamHandler.cjs");
const defaultRenderHandler = require("./defaultRenderHandler.cjs");
const startServerCore = require("@tanstack/start-server-core");
exports.StartServer = StartServer.StartServer;
exports.defaultStreamHandler = defaultStreamHandler.defaultStreamHandler;
exports.defaultRenderHandler = defaultRenderHandler.defaultRenderHandler;
Object.keys(startServerCore).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startServerCore[k]
  });
});
//# sourceMappingURL=index.cjs.map
