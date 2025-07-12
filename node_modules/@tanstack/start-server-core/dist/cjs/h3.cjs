"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_async_hooks = require("node:async_hooks");
const h3 = require("h3");
const eventStorage = new node_async_hooks.AsyncLocalStorage();
function _setContext(event, key, value) {
  event.context[key] = value;
}
function _getContext(event, key) {
  return event.context[key];
}
function defineMiddleware(options) {
  return options;
}
function defineEventHandler(handler) {
  return h3.defineEventHandler((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
function eventHandler(handler) {
  return h3.eventHandler((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
async function runWithEvent(event, fn) {
  return eventStorage.run(event, fn);
}
function getEvent() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event;
}
const HTTPEventSymbol = Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof h3.H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof h3.H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    const event = args[0];
    if (!isEvent(event)) {
      args.unshift(getEvent());
    } else {
      args[0] = event instanceof h3.H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const readRawBody = createWrapperFunction(h3.readRawBody);
const readBody = createWrapperFunction(h3.readBody);
const getQuery = createWrapperFunction(h3.getQuery);
const isMethod = createWrapperFunction(h3.isMethod);
const isPreflightRequest = createWrapperFunction(h3.isPreflightRequest);
const getValidatedQuery = createWrapperFunction(h3.getValidatedQuery);
const getRouterParams = createWrapperFunction(h3.getRouterParams);
const getRouterParam = createWrapperFunction(h3.getRouterParam);
const getValidatedRouterParams = createWrapperFunction(h3.getValidatedRouterParams);
const assertMethod = createWrapperFunction(h3.assertMethod);
const getRequestHeaders = createWrapperFunction(h3.getRequestHeaders);
const getRequestHeader = createWrapperFunction(h3.getRequestHeader);
const getRequestURL = createWrapperFunction(h3.getRequestURL);
const getRequestHost = createWrapperFunction(h3.getRequestHost);
const getRequestProtocol = createWrapperFunction(h3.getRequestProtocol);
const getRequestIP = createWrapperFunction(h3.getRequestIP);
const send = createWrapperFunction(h3.send);
const sendNoContent = createWrapperFunction(h3.sendNoContent);
const setResponseStatus = createWrapperFunction(h3.setResponseStatus);
const getResponseStatus = createWrapperFunction(h3.getResponseStatus);
const getResponseStatusText = createWrapperFunction(
  h3.getResponseStatusText
);
const getResponseHeaders = createWrapperFunction(h3.getResponseHeaders);
const getResponseHeader = createWrapperFunction(h3.getResponseHeader);
const setResponseHeaders = createWrapperFunction(h3.setResponseHeaders);
const setResponseHeader = createWrapperFunction(h3.setResponseHeader);
const appendResponseHeaders = createWrapperFunction(
  h3.appendResponseHeaders
);
const appendResponseHeader = createWrapperFunction(h3.appendResponseHeader);
const defaultContentType = createWrapperFunction(h3.defaultContentType);
const sendRedirect = createWrapperFunction(h3.sendRedirect);
const sendStream = createWrapperFunction(h3.sendStream);
const writeEarlyHints = createWrapperFunction(h3.writeEarlyHints);
const sendError = createWrapperFunction(h3.sendError);
const sendProxy = createWrapperFunction(h3.sendProxy);
const proxyRequest = createWrapperFunction(h3.proxyRequest);
const fetchWithEvent = createWrapperFunction(h3.fetchWithEvent);
const getProxyRequestHeaders = createWrapperFunction(
  h3.getProxyRequestHeaders
);
const parseCookies = createWrapperFunction(h3.parseCookies);
const getCookie = createWrapperFunction(h3.getCookie);
const setCookie = createWrapperFunction(h3.setCookie);
const deleteCookie = createWrapperFunction(h3.deleteCookie);
const useSession = createWrapperFunction(h3.useSession);
const getSession = createWrapperFunction(h3.getSession);
const updateSession = createWrapperFunction(h3.updateSession);
const sealSession = createWrapperFunction(
  h3.sealSession
);
const unsealSession = createWrapperFunction(h3.unsealSession);
const clearSession = createWrapperFunction(h3.clearSession);
const handleCacheHeaders = createWrapperFunction(h3.handleCacheHeaders);
const handleCors = createWrapperFunction(h3.handleCors);
const appendCorsHeaders = createWrapperFunction(h3.appendCorsHeaders);
const appendCorsPreflightHeaders = createWrapperFunction(
  h3.appendCorsPreflightHeaders
);
const sendWebResponse = createWrapperFunction(h3.sendWebResponse);
const appendHeader = createWrapperFunction(h3.appendHeader);
const appendHeaders = createWrapperFunction(h3.appendHeaders);
const setHeader = createWrapperFunction(h3.setHeader);
const setHeaders = createWrapperFunction(h3.setHeaders);
const getHeader = createWrapperFunction(h3.getHeader);
const getHeaders = createWrapperFunction(h3.getHeaders);
const getRequestFingerprint = createWrapperFunction(
  h3.getRequestFingerprint
);
const getRequestWebStream = createWrapperFunction(h3.getRequestWebStream);
const readFormData = createWrapperFunction(h3.readFormData);
const readMultipartFormData = createWrapperFunction(
  h3.readMultipartFormData
);
const readValidatedBody = createWrapperFunction(h3.readValidatedBody);
const removeResponseHeader = createWrapperFunction(h3.removeResponseHeader);
const getContext = createWrapperFunction(_getContext);
const setContext = createWrapperFunction(_setContext);
const clearResponseHeaders = createWrapperFunction(h3.clearResponseHeaders);
const getWebRequest = createWrapperFunction(h3.toWebRequest);
function requestHandler(handler) {
  return handler;
}
Object.defineProperty(exports, "H3Error", {
  enumerable: true,
  get: () => h3.H3Error
});
Object.defineProperty(exports, "H3Event", {
  enumerable: true,
  get: () => h3.H3Event
});
Object.defineProperty(exports, "MIMES", {
  enumerable: true,
  get: () => h3.MIMES
});
Object.defineProperty(exports, "callNodeListener", {
  enumerable: true,
  get: () => h3.callNodeListener
});
Object.defineProperty(exports, "createApp", {
  enumerable: true,
  get: () => h3.createApp
});
Object.defineProperty(exports, "createAppEventHandler", {
  enumerable: true,
  get: () => h3.createAppEventHandler
});
Object.defineProperty(exports, "createError", {
  enumerable: true,
  get: () => h3.createError
});
Object.defineProperty(exports, "createEvent", {
  enumerable: true,
  get: () => h3.createEvent
});
Object.defineProperty(exports, "createRouter", {
  enumerable: true,
  get: () => h3.createRouter
});
Object.defineProperty(exports, "defineLazyEventHandler", {
  enumerable: true,
  get: () => h3.defineLazyEventHandler
});
Object.defineProperty(exports, "defineNodeListener", {
  enumerable: true,
  get: () => h3.defineNodeListener
});
Object.defineProperty(exports, "defineNodeMiddleware", {
  enumerable: true,
  get: () => h3.defineNodeMiddleware
});
Object.defineProperty(exports, "defineRequestMiddleware", {
  enumerable: true,
  get: () => h3.defineRequestMiddleware
});
Object.defineProperty(exports, "defineResponseMiddleware", {
  enumerable: true,
  get: () => h3.defineResponseMiddleware
});
Object.defineProperty(exports, "defineWebSocket", {
  enumerable: true,
  get: () => h3.defineWebSocket
});
Object.defineProperty(exports, "dynamicEventHandler", {
  enumerable: true,
  get: () => h3.dynamicEventHandler
});
Object.defineProperty(exports, "fromNodeMiddleware", {
  enumerable: true,
  get: () => h3.fromNodeMiddleware
});
Object.defineProperty(exports, "fromPlainHandler", {
  enumerable: true,
  get: () => h3.fromPlainHandler
});
Object.defineProperty(exports, "fromWebHandler", {
  enumerable: true,
  get: () => h3.fromWebHandler
});
Object.defineProperty(exports, "isCorsOriginAllowed", {
  enumerable: true,
  get: () => h3.isCorsOriginAllowed
});
Object.defineProperty(exports, "isError", {
  enumerable: true,
  get: () => h3.isError
});
Object.defineProperty(exports, "isEventHandler", {
  enumerable: true,
  get: () => h3.isEventHandler
});
Object.defineProperty(exports, "isStream", {
  enumerable: true,
  get: () => h3.isStream
});
Object.defineProperty(exports, "isWebResponse", {
  enumerable: true,
  get: () => h3.isWebResponse
});
Object.defineProperty(exports, "lazyEventHandler", {
  enumerable: true,
  get: () => h3.lazyEventHandler
});
Object.defineProperty(exports, "promisifyNodeListener", {
  enumerable: true,
  get: () => h3.promisifyNodeListener
});
Object.defineProperty(exports, "sanitizeStatusCode", {
  enumerable: true,
  get: () => h3.sanitizeStatusCode
});
Object.defineProperty(exports, "sanitizeStatusMessage", {
  enumerable: true,
  get: () => h3.sanitizeStatusMessage
});
Object.defineProperty(exports, "serveStatic", {
  enumerable: true,
  get: () => h3.serveStatic
});
Object.defineProperty(exports, "splitCookiesString", {
  enumerable: true,
  get: () => h3.splitCookiesString
});
Object.defineProperty(exports, "toEventHandler", {
  enumerable: true,
  get: () => h3.toEventHandler
});
Object.defineProperty(exports, "toNodeListener", {
  enumerable: true,
  get: () => h3.toNodeListener
});
Object.defineProperty(exports, "toPlainHandler", {
  enumerable: true,
  get: () => h3.toPlainHandler
});
Object.defineProperty(exports, "toWebHandler", {
  enumerable: true,
  get: () => h3.toWebHandler
});
Object.defineProperty(exports, "toWebRequest", {
  enumerable: true,
  get: () => h3.toWebRequest
});
Object.defineProperty(exports, "useBase", {
  enumerable: true,
  get: () => h3.useBase
});
exports.HTTPEventSymbol = HTTPEventSymbol;
exports.appendCorsHeaders = appendCorsHeaders;
exports.appendCorsPreflightHeaders = appendCorsPreflightHeaders;
exports.appendHeader = appendHeader;
exports.appendHeaders = appendHeaders;
exports.appendResponseHeader = appendResponseHeader;
exports.appendResponseHeaders = appendResponseHeaders;
exports.assertMethod = assertMethod;
exports.clearResponseHeaders = clearResponseHeaders;
exports.clearSession = clearSession;
exports.defaultContentType = defaultContentType;
exports.defineEventHandler = defineEventHandler;
exports.defineMiddleware = defineMiddleware;
exports.deleteCookie = deleteCookie;
exports.eventHandler = eventHandler;
exports.fetchWithEvent = fetchWithEvent;
exports.getContext = getContext;
exports.getCookie = getCookie;
exports.getEvent = getEvent;
exports.getHeader = getHeader;
exports.getHeaders = getHeaders;
exports.getProxyRequestHeaders = getProxyRequestHeaders;
exports.getQuery = getQuery;
exports.getRequestFingerprint = getRequestFingerprint;
exports.getRequestHeader = getRequestHeader;
exports.getRequestHeaders = getRequestHeaders;
exports.getRequestHost = getRequestHost;
exports.getRequestIP = getRequestIP;
exports.getRequestProtocol = getRequestProtocol;
exports.getRequestURL = getRequestURL;
exports.getRequestWebStream = getRequestWebStream;
exports.getResponseHeader = getResponseHeader;
exports.getResponseHeaders = getResponseHeaders;
exports.getResponseStatus = getResponseStatus;
exports.getResponseStatusText = getResponseStatusText;
exports.getRouterParam = getRouterParam;
exports.getRouterParams = getRouterParams;
exports.getSession = getSession;
exports.getValidatedQuery = getValidatedQuery;
exports.getValidatedRouterParams = getValidatedRouterParams;
exports.getWebRequest = getWebRequest;
exports.handleCacheHeaders = handleCacheHeaders;
exports.handleCors = handleCors;
exports.isEvent = isEvent;
exports.isMethod = isMethod;
exports.isPreflightRequest = isPreflightRequest;
exports.parseCookies = parseCookies;
exports.proxyRequest = proxyRequest;
exports.readBody = readBody;
exports.readFormData = readFormData;
exports.readMultipartFormData = readMultipartFormData;
exports.readRawBody = readRawBody;
exports.readValidatedBody = readValidatedBody;
exports.removeResponseHeader = removeResponseHeader;
exports.requestHandler = requestHandler;
exports.runWithEvent = runWithEvent;
exports.sealSession = sealSession;
exports.send = send;
exports.sendError = sendError;
exports.sendNoContent = sendNoContent;
exports.sendProxy = sendProxy;
exports.sendRedirect = sendRedirect;
exports.sendStream = sendStream;
exports.sendWebResponse = sendWebResponse;
exports.setContext = setContext;
exports.setCookie = setCookie;
exports.setHeader = setHeader;
exports.setHeaders = setHeaders;
exports.setResponseHeader = setResponseHeader;
exports.setResponseHeaders = setResponseHeaders;
exports.setResponseStatus = setResponseStatus;
exports.unsealSession = unsealSession;
exports.updateSession = updateSession;
exports.useSession = useSession;
exports.writeEarlyHints = writeEarlyHints;
//# sourceMappingURL=h3.cjs.map
