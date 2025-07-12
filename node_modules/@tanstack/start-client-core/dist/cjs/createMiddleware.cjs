"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function createMiddleware(options, __opts) {
  const resolvedOptions = {
    type: "function",
    ...__opts || options
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { middleware })
      );
    },
    validator: (validator) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { validator })
      );
    },
    client: (client) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { client })
      );
    },
    server: (server) => {
      return createMiddleware(
        {},
        Object.assign(resolvedOptions, { server })
      );
    }
  };
}
exports.createMiddleware = createMiddleware;
//# sourceMappingURL=createMiddleware.cjs.map
