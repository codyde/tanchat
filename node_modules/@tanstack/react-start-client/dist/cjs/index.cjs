"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startClientCore = require("@tanstack/start-client-core");
const Meta = require("./Meta.cjs");
const Scripts = require("./Scripts.cjs");
const StartClient = require("./StartClient.cjs");
const renderRSC = require("./renderRSC.cjs");
const useServerFn = require("./useServerFn.cjs");
Object.defineProperty(exports, "clientOnly", {
  enumerable: true,
  get: () => startClientCore.clientOnly
});
Object.defineProperty(exports, "createIsomorphicFn", {
  enumerable: true,
  get: () => startClientCore.createIsomorphicFn
});
Object.defineProperty(exports, "createMiddleware", {
  enumerable: true,
  get: () => startClientCore.createMiddleware
});
Object.defineProperty(exports, "createServerFn", {
  enumerable: true,
  get: () => startClientCore.createServerFn
});
Object.defineProperty(exports, "globalMiddleware", {
  enumerable: true,
  get: () => startClientCore.globalMiddleware
});
Object.defineProperty(exports, "json", {
  enumerable: true,
  get: () => startClientCore.json
});
Object.defineProperty(exports, "mergeHeaders", {
  enumerable: true,
  get: () => startClientCore.mergeHeaders
});
Object.defineProperty(exports, "registerGlobalMiddleware", {
  enumerable: true,
  get: () => startClientCore.registerGlobalMiddleware
});
Object.defineProperty(exports, "serverOnly", {
  enumerable: true,
  get: () => startClientCore.serverOnly
});
Object.defineProperty(exports, "startSerializer", {
  enumerable: true,
  get: () => startClientCore.startSerializer
});
exports.Meta = Meta.Meta;
exports.Scripts = Scripts.Scripts;
exports.StartClient = StartClient.StartClient;
exports.renderRsc = renderRSC.renderRsc;
exports.useServerFn = useServerFn.useServerFn;
//# sourceMappingURL=index.cjs.map
