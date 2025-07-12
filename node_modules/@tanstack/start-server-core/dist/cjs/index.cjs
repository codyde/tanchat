"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const createStartHandler = require("./createStartHandler.cjs");
const server = require("@tanstack/router-core/ssr/server");
const serverFunctionsHandler = require("./server-functions-handler.cjs");
const h3 = require("./h3.cjs");
const serverRoute = require("./serverRoute.cjs");
const virtualModules = require("./virtual-modules.cjs");
const h3$1 = require("h3");
exports.createStartHandler = createStartHandler.createStartHandler;
Object.defineProperty(exports, "attachRouterServerSsrUtils", {
  enumerable: true,
  get: () => server.attachRouterServerSsrUtils
});
Object.defineProperty(exports, "createRequestHandler", {
  enumerable: true,
  get: () => server.createRequestHandler
});
Object.defineProperty(exports, "defineHandlerCallback", {
  enumerable: true,
  get: () => server.defineHandlerCallback
});
Object.defineProperty(exports, "transformPipeableStreamWithRouter", {
  enumerable: true,
  get: () => server.transformPipeableStreamWithRouter
});
Object.defineProperty(exports, "transformReadableStreamWithRouter", {
  enumerable: true,
  get: () => server.transformReadableStreamWithRouter
});
exports.handleServerAction = serverFunctionsHandler.handleServerAction;
exports.HTTPEventSymbol = h3.HTTPEventSymbol;
exports.appendCorsHeaders = h3.appendCorsHeaders;
exports.appendCorsPreflightHeaders = h3.appendCorsPreflightHeaders;
exports.appendHeader = h3.appendHeader;
exports.appendHeaders = h3.appendHeaders;
exports.appendResponseHeader = h3.appendResponseHeader;
exports.appendResponseHeaders = h3.appendResponseHeaders;
exports.assertMethod = h3.assertMethod;
exports.clearResponseHeaders = h3.clearResponseHeaders;
exports.clearSession = h3.clearSession;
exports.defaultContentType = h3.defaultContentType;
exports.defineEventHandler = h3.defineEventHandler;
exports.defineMiddleware = h3.defineMiddleware;
exports.deleteCookie = h3.deleteCookie;
exports.eventHandler = h3.eventHandler;
exports.fetchWithEvent = h3.fetchWithEvent;
exports.getContext = h3.getContext;
exports.getCookie = h3.getCookie;
exports.getEvent = h3.getEvent;
exports.getHeader = h3.getHeader;
exports.getHeaders = h3.getHeaders;
exports.getProxyRequestHeaders = h3.getProxyRequestHeaders;
exports.getQuery = h3.getQuery;
exports.getRequestFingerprint = h3.getRequestFingerprint;
exports.getRequestHeader = h3.getRequestHeader;
exports.getRequestHeaders = h3.getRequestHeaders;
exports.getRequestHost = h3.getRequestHost;
exports.getRequestIP = h3.getRequestIP;
exports.getRequestProtocol = h3.getRequestProtocol;
exports.getRequestURL = h3.getRequestURL;
exports.getRequestWebStream = h3.getRequestWebStream;
exports.getResponseHeader = h3.getResponseHeader;
exports.getResponseHeaders = h3.getResponseHeaders;
exports.getResponseStatus = h3.getResponseStatus;
exports.getResponseStatusText = h3.getResponseStatusText;
exports.getRouterParam = h3.getRouterParam;
exports.getRouterParams = h3.getRouterParams;
exports.getSession = h3.getSession;
exports.getValidatedQuery = h3.getValidatedQuery;
exports.getValidatedRouterParams = h3.getValidatedRouterParams;
exports.getWebRequest = h3.getWebRequest;
exports.handleCacheHeaders = h3.handleCacheHeaders;
exports.handleCors = h3.handleCors;
exports.isEvent = h3.isEvent;
exports.isMethod = h3.isMethod;
exports.isPreflightRequest = h3.isPreflightRequest;
exports.parseCookies = h3.parseCookies;
exports.proxyRequest = h3.proxyRequest;
exports.readBody = h3.readBody;
exports.readFormData = h3.readFormData;
exports.readMultipartFormData = h3.readMultipartFormData;
exports.readRawBody = h3.readRawBody;
exports.readValidatedBody = h3.readValidatedBody;
exports.removeResponseHeader = h3.removeResponseHeader;
exports.requestHandler = h3.requestHandler;
exports.runWithEvent = h3.runWithEvent;
exports.sealSession = h3.sealSession;
exports.send = h3.send;
exports.sendError = h3.sendError;
exports.sendNoContent = h3.sendNoContent;
exports.sendProxy = h3.sendProxy;
exports.sendRedirect = h3.sendRedirect;
exports.sendStream = h3.sendStream;
exports.sendWebResponse = h3.sendWebResponse;
exports.setContext = h3.setContext;
exports.setCookie = h3.setCookie;
exports.setHeader = h3.setHeader;
exports.setHeaders = h3.setHeaders;
exports.setResponseHeader = h3.setResponseHeader;
exports.setResponseHeaders = h3.setResponseHeaders;
exports.setResponseStatus = h3.setResponseStatus;
exports.unsealSession = h3.unsealSession;
exports.updateSession = h3.updateSession;
exports.useSession = h3.useSession;
exports.writeEarlyHints = h3.writeEarlyHints;
exports.createServerFileRoute = serverRoute.createServerFileRoute;
exports.createServerRootRoute = serverRoute.createServerRootRoute;
exports.createServerRoute = serverRoute.createServerRoute;
exports.VIRTUAL_MODULES = virtualModules.VIRTUAL_MODULES;
Object.defineProperty(exports, "H3Error", {
  enumerable: true,
  get: () => h3$1.H3Error
});
Object.defineProperty(exports, "H3Event", {
  enumerable: true,
  get: () => h3$1.H3Event
});
Object.defineProperty(exports, "MIMES", {
  enumerable: true,
  get: () => h3$1.MIMES
});
Object.defineProperty(exports, "callNodeListener", {
  enumerable: true,
  get: () => h3$1.callNodeListener
});
Object.defineProperty(exports, "createApp", {
  enumerable: true,
  get: () => h3$1.createApp
});
Object.defineProperty(exports, "createAppEventHandler", {
  enumerable: true,
  get: () => h3$1.createAppEventHandler
});
Object.defineProperty(exports, "createError", {
  enumerable: true,
  get: () => h3$1.createError
});
Object.defineProperty(exports, "createEvent", {
  enumerable: true,
  get: () => h3$1.createEvent
});
Object.defineProperty(exports, "createRouter", {
  enumerable: true,
  get: () => h3$1.createRouter
});
Object.defineProperty(exports, "defineLazyEventHandler", {
  enumerable: true,
  get: () => h3$1.defineLazyEventHandler
});
Object.defineProperty(exports, "defineNodeListener", {
  enumerable: true,
  get: () => h3$1.defineNodeListener
});
Object.defineProperty(exports, "defineNodeMiddleware", {
  enumerable: true,
  get: () => h3$1.defineNodeMiddleware
});
Object.defineProperty(exports, "defineRequestMiddleware", {
  enumerable: true,
  get: () => h3$1.defineRequestMiddleware
});
Object.defineProperty(exports, "defineResponseMiddleware", {
  enumerable: true,
  get: () => h3$1.defineResponseMiddleware
});
Object.defineProperty(exports, "defineWebSocket", {
  enumerable: true,
  get: () => h3$1.defineWebSocket
});
Object.defineProperty(exports, "dynamicEventHandler", {
  enumerable: true,
  get: () => h3$1.dynamicEventHandler
});
Object.defineProperty(exports, "fromNodeMiddleware", {
  enumerable: true,
  get: () => h3$1.fromNodeMiddleware
});
Object.defineProperty(exports, "fromPlainHandler", {
  enumerable: true,
  get: () => h3$1.fromPlainHandler
});
Object.defineProperty(exports, "fromWebHandler", {
  enumerable: true,
  get: () => h3$1.fromWebHandler
});
Object.defineProperty(exports, "isCorsOriginAllowed", {
  enumerable: true,
  get: () => h3$1.isCorsOriginAllowed
});
Object.defineProperty(exports, "isError", {
  enumerable: true,
  get: () => h3$1.isError
});
Object.defineProperty(exports, "isEventHandler", {
  enumerable: true,
  get: () => h3$1.isEventHandler
});
Object.defineProperty(exports, "isStream", {
  enumerable: true,
  get: () => h3$1.isStream
});
Object.defineProperty(exports, "isWebResponse", {
  enumerable: true,
  get: () => h3$1.isWebResponse
});
Object.defineProperty(exports, "lazyEventHandler", {
  enumerable: true,
  get: () => h3$1.lazyEventHandler
});
Object.defineProperty(exports, "promisifyNodeListener", {
  enumerable: true,
  get: () => h3$1.promisifyNodeListener
});
Object.defineProperty(exports, "sanitizeStatusCode", {
  enumerable: true,
  get: () => h3$1.sanitizeStatusCode
});
Object.defineProperty(exports, "sanitizeStatusMessage", {
  enumerable: true,
  get: () => h3$1.sanitizeStatusMessage
});
Object.defineProperty(exports, "serveStatic", {
  enumerable: true,
  get: () => h3$1.serveStatic
});
Object.defineProperty(exports, "splitCookiesString", {
  enumerable: true,
  get: () => h3$1.splitCookiesString
});
Object.defineProperty(exports, "toEventHandler", {
  enumerable: true,
  get: () => h3$1.toEventHandler
});
Object.defineProperty(exports, "toNodeListener", {
  enumerable: true,
  get: () => h3$1.toNodeListener
});
Object.defineProperty(exports, "toPlainHandler", {
  enumerable: true,
  get: () => h3$1.toPlainHandler
});
Object.defineProperty(exports, "toWebHandler", {
  enumerable: true,
  get: () => h3$1.toWebHandler
});
Object.defineProperty(exports, "toWebRequest", {
  enumerable: true,
  get: () => h3$1.toWebRequest
});
Object.defineProperty(exports, "useBase", {
  enumerable: true,
  get: () => h3$1.useBase
});
//# sourceMappingURL=index.cjs.map
