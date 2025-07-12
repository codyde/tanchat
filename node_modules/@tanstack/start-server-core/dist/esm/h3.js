import { AsyncLocalStorage } from "node:async_hooks";
import { defineEventHandler as defineEventHandler$1, eventHandler as eventHandler$1, H3Event, readRawBody as readRawBody$1, readBody as readBody$1, getQuery as getQuery$1, isMethod as isMethod$1, isPreflightRequest as isPreflightRequest$1, getValidatedQuery as getValidatedQuery$1, getRouterParams as getRouterParams$1, getRouterParam as getRouterParam$1, getValidatedRouterParams as getValidatedRouterParams$1, assertMethod as assertMethod$1, getRequestHeaders as getRequestHeaders$1, getRequestHeader as getRequestHeader$1, getRequestURL as getRequestURL$1, getRequestHost as getRequestHost$1, getRequestProtocol as getRequestProtocol$1, getRequestIP as getRequestIP$1, send as send$1, sendNoContent as sendNoContent$1, setResponseStatus as setResponseStatus$1, getResponseStatus as getResponseStatus$1, getResponseStatusText as getResponseStatusText$1, getResponseHeaders as getResponseHeaders$1, getResponseHeader as getResponseHeader$1, setResponseHeaders as setResponseHeaders$1, setResponseHeader as setResponseHeader$1, appendResponseHeaders as appendResponseHeaders$1, appendResponseHeader as appendResponseHeader$1, defaultContentType as defaultContentType$1, sendRedirect as sendRedirect$1, sendStream as sendStream$1, writeEarlyHints as writeEarlyHints$1, sendError as sendError$1, sendProxy as sendProxy$1, proxyRequest as proxyRequest$1, fetchWithEvent as fetchWithEvent$1, getProxyRequestHeaders as getProxyRequestHeaders$1, parseCookies as parseCookies$1, getCookie as getCookie$1, setCookie as setCookie$1, deleteCookie as deleteCookie$1, useSession as useSession$1, getSession as getSession$1, updateSession as updateSession$1, sealSession as sealSession$1, unsealSession as unsealSession$1, clearSession as clearSession$1, handleCacheHeaders as handleCacheHeaders$1, handleCors as handleCors$1, appendCorsHeaders as appendCorsHeaders$1, appendCorsPreflightHeaders as appendCorsPreflightHeaders$1, sendWebResponse as sendWebResponse$1, appendHeader as appendHeader$1, appendHeaders as appendHeaders$1, setHeader as setHeader$1, setHeaders as setHeaders$1, getHeader as getHeader$1, getHeaders as getHeaders$1, getRequestFingerprint as getRequestFingerprint$1, getRequestWebStream as getRequestWebStream$1, readFormData as readFormData$1, readMultipartFormData as readMultipartFormData$1, readValidatedBody as readValidatedBody$1, removeResponseHeader as removeResponseHeader$1, clearResponseHeaders as clearResponseHeaders$1, toWebRequest } from "h3";
import { H3Error, H3Event as H3Event2, MIMES, callNodeListener, createApp, createAppEventHandler, createError, createEvent, createRouter, defineLazyEventHandler, defineNodeListener, defineNodeMiddleware, defineRequestMiddleware, defineResponseMiddleware, defineWebSocket, dynamicEventHandler, fromNodeMiddleware, fromPlainHandler, fromWebHandler, isCorsOriginAllowed, isError, isEventHandler, isStream, isWebResponse, lazyEventHandler, promisifyNodeListener, sanitizeStatusCode, sanitizeStatusMessage, serveStatic, splitCookiesString, toEventHandler, toNodeListener, toPlainHandler, toWebHandler, toWebRequest as toWebRequest2, useBase } from "h3";
const eventStorage = new AsyncLocalStorage();
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
  return defineEventHandler$1((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
function eventHandler(handler) {
  return eventHandler$1((event) => {
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
  return typeof obj === "object" && (obj instanceof H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    const event = args[0];
    if (!isEvent(event)) {
      args.unshift(getEvent());
    } else {
      args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const readRawBody = createWrapperFunction(readRawBody$1);
const readBody = createWrapperFunction(readBody$1);
const getQuery = createWrapperFunction(getQuery$1);
const isMethod = createWrapperFunction(isMethod$1);
const isPreflightRequest = createWrapperFunction(isPreflightRequest$1);
const getValidatedQuery = createWrapperFunction(getValidatedQuery$1);
const getRouterParams = createWrapperFunction(getRouterParams$1);
const getRouterParam = createWrapperFunction(getRouterParam$1);
const getValidatedRouterParams = createWrapperFunction(getValidatedRouterParams$1);
const assertMethod = createWrapperFunction(assertMethod$1);
const getRequestHeaders = createWrapperFunction(getRequestHeaders$1);
const getRequestHeader = createWrapperFunction(getRequestHeader$1);
const getRequestURL = createWrapperFunction(getRequestURL$1);
const getRequestHost = createWrapperFunction(getRequestHost$1);
const getRequestProtocol = createWrapperFunction(getRequestProtocol$1);
const getRequestIP = createWrapperFunction(getRequestIP$1);
const send = createWrapperFunction(send$1);
const sendNoContent = createWrapperFunction(sendNoContent$1);
const setResponseStatus = createWrapperFunction(setResponseStatus$1);
const getResponseStatus = createWrapperFunction(getResponseStatus$1);
const getResponseStatusText = createWrapperFunction(
  getResponseStatusText$1
);
const getResponseHeaders = createWrapperFunction(getResponseHeaders$1);
const getResponseHeader = createWrapperFunction(getResponseHeader$1);
const setResponseHeaders = createWrapperFunction(setResponseHeaders$1);
const setResponseHeader = createWrapperFunction(setResponseHeader$1);
const appendResponseHeaders = createWrapperFunction(
  appendResponseHeaders$1
);
const appendResponseHeader = createWrapperFunction(appendResponseHeader$1);
const defaultContentType = createWrapperFunction(defaultContentType$1);
const sendRedirect = createWrapperFunction(sendRedirect$1);
const sendStream = createWrapperFunction(sendStream$1);
const writeEarlyHints = createWrapperFunction(writeEarlyHints$1);
const sendError = createWrapperFunction(sendError$1);
const sendProxy = createWrapperFunction(sendProxy$1);
const proxyRequest = createWrapperFunction(proxyRequest$1);
const fetchWithEvent = createWrapperFunction(fetchWithEvent$1);
const getProxyRequestHeaders = createWrapperFunction(
  getProxyRequestHeaders$1
);
const parseCookies = createWrapperFunction(parseCookies$1);
const getCookie = createWrapperFunction(getCookie$1);
const setCookie = createWrapperFunction(setCookie$1);
const deleteCookie = createWrapperFunction(deleteCookie$1);
const useSession = createWrapperFunction(useSession$1);
const getSession = createWrapperFunction(getSession$1);
const updateSession = createWrapperFunction(updateSession$1);
const sealSession = createWrapperFunction(
  sealSession$1
);
const unsealSession = createWrapperFunction(unsealSession$1);
const clearSession = createWrapperFunction(clearSession$1);
const handleCacheHeaders = createWrapperFunction(handleCacheHeaders$1);
const handleCors = createWrapperFunction(handleCors$1);
const appendCorsHeaders = createWrapperFunction(appendCorsHeaders$1);
const appendCorsPreflightHeaders = createWrapperFunction(
  appendCorsPreflightHeaders$1
);
const sendWebResponse = createWrapperFunction(sendWebResponse$1);
const appendHeader = createWrapperFunction(appendHeader$1);
const appendHeaders = createWrapperFunction(appendHeaders$1);
const setHeader = createWrapperFunction(setHeader$1);
const setHeaders = createWrapperFunction(setHeaders$1);
const getHeader = createWrapperFunction(getHeader$1);
const getHeaders = createWrapperFunction(getHeaders$1);
const getRequestFingerprint = createWrapperFunction(
  getRequestFingerprint$1
);
const getRequestWebStream = createWrapperFunction(getRequestWebStream$1);
const readFormData = createWrapperFunction(readFormData$1);
const readMultipartFormData = createWrapperFunction(
  readMultipartFormData$1
);
const readValidatedBody = createWrapperFunction(readValidatedBody$1);
const removeResponseHeader = createWrapperFunction(removeResponseHeader$1);
const getContext = createWrapperFunction(_getContext);
const setContext = createWrapperFunction(_setContext);
const clearResponseHeaders = createWrapperFunction(clearResponseHeaders$1);
const getWebRequest = createWrapperFunction(toWebRequest);
function requestHandler(handler) {
  return handler;
}
export {
  H3Error,
  H3Event2 as H3Event,
  HTTPEventSymbol,
  MIMES,
  appendCorsHeaders,
  appendCorsPreflightHeaders,
  appendHeader,
  appendHeaders,
  appendResponseHeader,
  appendResponseHeaders,
  assertMethod,
  callNodeListener,
  clearResponseHeaders,
  clearSession,
  createApp,
  createAppEventHandler,
  createError,
  createEvent,
  createRouter,
  defaultContentType,
  defineEventHandler,
  defineLazyEventHandler,
  defineMiddleware,
  defineNodeListener,
  defineNodeMiddleware,
  defineRequestMiddleware,
  defineResponseMiddleware,
  defineWebSocket,
  deleteCookie,
  dynamicEventHandler,
  eventHandler,
  fetchWithEvent,
  fromNodeMiddleware,
  fromPlainHandler,
  fromWebHandler,
  getContext,
  getCookie,
  getEvent,
  getHeader,
  getHeaders,
  getProxyRequestHeaders,
  getQuery,
  getRequestFingerprint,
  getRequestHeader,
  getRequestHeaders,
  getRequestHost,
  getRequestIP,
  getRequestProtocol,
  getRequestURL,
  getRequestWebStream,
  getResponseHeader,
  getResponseHeaders,
  getResponseStatus,
  getResponseStatusText,
  getRouterParam,
  getRouterParams,
  getSession,
  getValidatedQuery,
  getValidatedRouterParams,
  getWebRequest,
  handleCacheHeaders,
  handleCors,
  isCorsOriginAllowed,
  isError,
  isEvent,
  isEventHandler,
  isMethod,
  isPreflightRequest,
  isStream,
  isWebResponse,
  lazyEventHandler,
  parseCookies,
  promisifyNodeListener,
  proxyRequest,
  readBody,
  readFormData,
  readMultipartFormData,
  readRawBody,
  readValidatedBody,
  removeResponseHeader,
  requestHandler,
  runWithEvent,
  sanitizeStatusCode,
  sanitizeStatusMessage,
  sealSession,
  send,
  sendError,
  sendNoContent,
  sendProxy,
  sendRedirect,
  sendStream,
  sendWebResponse,
  serveStatic,
  setContext,
  setCookie,
  setHeader,
  setHeaders,
  setResponseHeader,
  setResponseHeaders,
  setResponseStatus,
  splitCookiesString,
  toEventHandler,
  toNodeListener,
  toPlainHandler,
  toWebHandler,
  toWebRequest2 as toWebRequest,
  unsealSession,
  updateSession,
  useBase,
  useSession,
  writeEarlyHints
};
//# sourceMappingURL=h3.js.map
