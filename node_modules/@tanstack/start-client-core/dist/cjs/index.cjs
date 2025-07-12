"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const client = require("@tanstack/router-core/ssr/client");
const serializer = require("./serializer.cjs");
const createIsomorphicFn = require("./createIsomorphicFn.cjs");
const envOnly = require("./envOnly.cjs");
const createServerFn = require("./createServerFn.cjs");
const createMiddleware = require("./createMiddleware.cjs");
const registerGlobalMiddleware = require("./registerGlobalMiddleware.cjs");
Object.defineProperty(exports, "hydrate", {
  enumerable: true,
  get: () => client.hydrate
});
Object.defineProperty(exports, "json", {
  enumerable: true,
  get: () => client.json
});
Object.defineProperty(exports, "mergeHeaders", {
  enumerable: true,
  get: () => client.mergeHeaders
});
exports.startSerializer = serializer.startSerializer;
exports.createIsomorphicFn = createIsomorphicFn.createIsomorphicFn;
exports.clientOnly = envOnly.clientOnly;
exports.serverOnly = envOnly.serverOnly;
exports.applyMiddleware = createServerFn.applyMiddleware;
exports.createServerFn = createServerFn.createServerFn;
exports.execValidator = createServerFn.execValidator;
exports.executeMiddleware = createServerFn.executeMiddleware;
exports.extractFormDataContext = createServerFn.extractFormDataContext;
exports.flattenMiddlewares = createServerFn.flattenMiddlewares;
exports.serverFnBaseToMiddleware = createServerFn.serverFnBaseToMiddleware;
Object.defineProperty(exports, "serverFnStaticCache", {
  enumerable: true,
  get: () => createServerFn.serverFnStaticCache
});
exports.createMiddleware = createMiddleware.createMiddleware;
exports.globalMiddleware = registerGlobalMiddleware.globalMiddleware;
exports.registerGlobalMiddleware = registerGlobalMiddleware.registerGlobalMiddleware;
//# sourceMappingURL=index.cjs.map
