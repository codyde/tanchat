"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const invariant = require("tiny-invariant");
const warning = require("tiny-warning");
const routerCore = require("@tanstack/router-core");
const client = require("@tanstack/router-core/ssr/client");
const registerGlobalMiddleware = require("./registerGlobalMiddleware.cjs");
const serializer = require("./serializer.cjs");
function createServerFn(options, __opts) {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") {
    resolvedOptions.method = "GET";
  }
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { middleware }));
    },
    validator: (validator) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { validator }));
    },
    type: (type) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, { type }));
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      Object.assign(resolvedOptions, {
        ...extractedFn,
        extractedFn,
        serverFn
      });
      const resolvedMiddleware = [
        ...resolvedOptions.middleware || [],
        serverFnBaseToMiddleware(resolvedOptions)
      ];
      return Object.assign(
        async (opts) => {
          return executeMiddleware(resolvedMiddleware, "client", {
            ...extractedFn,
            ...resolvedOptions,
            data: opts == null ? void 0 : opts.data,
            headers: opts == null ? void 0 : opts.headers,
            signal: opts == null ? void 0 : opts.signal,
            context: {}
          }).then((d) => {
            if (resolvedOptions.response === "full") {
              return d;
            }
            if (d.error) throw d.error;
            return d.result;
          });
        },
        {
          // This copies over the URL, function ID
          ...extractedFn,
          // The extracted function on the server-side calls
          // this function
          __executeServer: async (opts_, signal) => {
            var _a, _b;
            const opts = opts_ instanceof FormData ? extractFormDataContext(opts_) : opts_;
            opts.type = typeof resolvedOptions.type === "function" ? resolvedOptions.type(opts) : resolvedOptions.type;
            const ctx = {
              ...extractedFn,
              ...opts,
              signal
            };
            const run = () => executeMiddleware(resolvedMiddleware, "server", ctx).then(
              (d) => ({
                // Only send the result and sendContext back to the client
                result: d.result,
                error: d.error,
                context: d.sendContext
              })
            );
            if (ctx.type === "static") {
              let response;
              if ((_a = exports.serverFnStaticCache) == null ? void 0 : _a.getItem) {
                response = await exports.serverFnStaticCache.getItem(ctx);
              }
              if (!response) {
                response = await run().then((d) => {
                  return {
                    ctx: d,
                    error: null
                  };
                }).catch((e) => {
                  return {
                    ctx: void 0,
                    error: e
                  };
                });
                if ((_b = exports.serverFnStaticCache) == null ? void 0 : _b.setItem) {
                  await exports.serverFnStaticCache.setItem(ctx, response);
                }
              }
              invariant(
                response,
                "No response from both server and static cache!"
              );
              if (response.error) {
                throw response.error;
              }
              return response.ctx;
            }
            return run();
          }
        }
      );
    }
  };
}
async function executeMiddleware(middlewares, env, opts) {
  const flattenedMiddlewares = flattenMiddlewares([
    ...registerGlobalMiddleware.globalMiddleware,
    ...middlewares
  ]);
  const next = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) {
      return ctx;
    }
    if (nextMiddleware.options.validator && (env === "client" ? nextMiddleware.options.validateClient : true)) {
      ctx.data = await execValidator(nextMiddleware.options.validator, ctx.data);
    }
    const middlewareFn = env === "client" ? nextMiddleware.options.client : nextMiddleware.options.server;
    if (middlewareFn) {
      return applyMiddleware(middlewareFn, ctx, async (newCtx) => {
        return next(newCtx).catch((error) => {
          if (routerCore.isRedirect(error) || routerCore.isNotFound(error)) {
            return {
              ...newCtx,
              error
            };
          }
          throw error;
        });
      });
    }
    return next(ctx);
  };
  return next({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || {}
  });
}
exports.serverFnStaticCache = void 0;
function setServerFnStaticCache(cache) {
  const previousCache = exports.serverFnStaticCache;
  exports.serverFnStaticCache = typeof cache === "function" ? cache() : cache;
  return () => {
    exports.serverFnStaticCache = previousCache;
  };
}
function createServerFnStaticCache(serverFnStaticCache2) {
  return serverFnStaticCache2;
}
async function sha1Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
setServerFnStaticCache(() => {
  const getStaticCacheUrl = async (options, hash) => {
    const filename = await sha1Hash(`${options.functionId}__${hash}`);
    return `/__tsr/staticServerFnCache/${filename}.json`;
  };
  const jsonToFilenameSafeString = (json) => {
    const sortedKeysReplacer = (key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().reduce((acc, curr) => {
      acc[curr] = value[curr];
      return acc;
    }, {}) : value;
    const jsonString = JSON.stringify(json ?? "", sortedKeysReplacer);
    return jsonString.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
  };
  const staticClientCache = typeof document !== "undefined" ? /* @__PURE__ */ new Map() : null;
  return createServerFnStaticCache({
    getItem: async (ctx) => {
      if (typeof document === "undefined") {
        const hash = jsonToFilenameSafeString(ctx.data);
        const url = await getStaticCacheUrl(ctx, hash);
        const publicUrl = process.env.TSS_OUTPUT_PUBLIC_DIR;
        const { promises: fs } = await import("node:fs");
        const path = await import("node:path");
        const filePath = path.join(publicUrl, url);
        const [cachedResult, readError] = await fs.readFile(filePath, "utf-8").then((c) => [
          serializer.startSerializer.parse(c),
          null
        ]).catch((e) => [null, e]);
        if (readError && readError.code !== "ENOENT") {
          throw readError;
        }
        return cachedResult;
      }
      return void 0;
    },
    setItem: async (ctx, response) => {
      const { promises: fs } = await import("node:fs");
      const path = await import("node:path");
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      const publicUrl = process.env.TSS_OUTPUT_PUBLIC_DIR;
      const filePath = path.join(publicUrl, url);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, serializer.startSerializer.stringify(response));
    },
    fetchItem: async (ctx) => {
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      let result = staticClientCache == null ? void 0 : staticClientCache.get(url);
      if (!result) {
        result = await fetch(url, {
          method: "GET"
        }).then((r) => r.text()).then((d) => serializer.startSerializer.parse(d));
        staticClientCache == null ? void 0 : staticClientCache.set(url, result);
      }
      return result;
    }
  });
});
function extractFormDataContext(formData) {
  const serializedContext = formData.get("__TSR_CONTEXT");
  formData.delete("__TSR_CONTEXT");
  if (typeof serializedContext !== "string") {
    return {
      context: {},
      data: formData
    };
  }
  try {
    const context = serializer.startSerializer.parse(serializedContext);
    return {
      context,
      data: formData
    };
  } catch {
    return {
      data: formData
    };
  }
}
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m) => {
      if (m.options.middleware) {
        recurse(m.options.middleware);
      }
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
const applyMiddleware = async (middlewareFn, ctx, nextFn) => {
  return middlewareFn({
    ...ctx,
    next: async (userCtx = {}) => {
      return nextFn({
        ...ctx,
        ...userCtx,
        context: {
          ...ctx.context,
          ...userCtx.context
        },
        sendContext: {
          ...ctx.sendContext,
          ...userCtx.sendContext ?? {}
        },
        headers: client.mergeHeaders(ctx.headers, userCtx.headers),
        result: userCtx.result !== void 0 ? userCtx.result : ctx.response === "raw" ? userCtx : ctx.result,
        error: userCtx.error ?? ctx.error
      });
    }
  });
};
function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = validator["~standard"].validate(input);
    if (result instanceof Promise)
      throw new Error("Async validation not supported");
    if (result.issues)
      throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) {
    return validator.parse(input);
  }
  if (typeof validator === "function") {
    return validator(input);
  }
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    _types: void 0,
    options: {
      validator: options.validator,
      validateClient: options.validateClient,
      client: async ({ next, sendContext, ...ctx }) => {
        var _a;
        const payload = {
          ...ctx,
          // switch the sendContext over to context
          context: sendContext,
          type: typeof ctx.type === "function" ? ctx.type(ctx) : ctx.type
        };
        if (ctx.type === "static" && process.env.NODE_ENV === "production" && typeof document !== "undefined") {
          invariant(
            exports.serverFnStaticCache,
            "serverFnStaticCache.fetchItem is not available!"
          );
          const result = await exports.serverFnStaticCache.fetchItem(payload);
          if (result) {
            if (result.error) {
              throw result.error;
            }
            return next(result.ctx);
          }
          warning(
            result,
            `No static cache item found for ${payload.functionId}__${JSON.stringify(payload.data)}, falling back to server function...`
          );
        }
        const res = await ((_a = options.extractedFn) == null ? void 0 : _a.call(options, payload));
        return next(res);
      },
      server: async ({ next, ...ctx }) => {
        var _a;
        const result = await ((_a = options.serverFn) == null ? void 0 : _a.call(options, ctx));
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
exports.applyMiddleware = applyMiddleware;
exports.createServerFn = createServerFn;
exports.createServerFnStaticCache = createServerFnStaticCache;
exports.execValidator = execValidator;
exports.executeMiddleware = executeMiddleware;
exports.extractFormDataContext = extractFormDataContext;
exports.flattenMiddlewares = flattenMiddlewares;
exports.serverFnBaseToMiddleware = serverFnBaseToMiddleware;
exports.setServerFnStaticCache = setServerFnStaticCache;
//# sourceMappingURL=createServerFn.cjs.map
