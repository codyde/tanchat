"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startServerFunctionsFetcher = require("@tanstack/start-server-functions-fetcher");
const startClientCore = require("@tanstack/start-client-core");
const startServerCore = require("@tanstack/start-server-core");
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createSsrRpc = (functionId, serverBase) => {
  const url = `/${sanitizeBase(serverBase)}/${functionId}`;
  const ssrFn = (...args) => {
    return startServerFunctionsFetcher.serverFnFetcher(url, args, async (url2, requestInit) => {
      requestInit.headers = startClientCore.mergeHeaders(startServerCore.getHeaders(), requestInit.headers);
      const res = await $fetch.native(url2, requestInit);
      const event = startServerCore.getEvent();
      const mergedHeaders = startClientCore.mergeHeaders(
        res.headers,
        event.___ssrRpcResponseHeaders
      );
      event.___ssrRpcResponseHeaders = mergedHeaders;
      return res;
    });
  };
  return Object.assign(ssrFn, {
    url,
    functionId
  });
};
exports.createSsrRpc = createSsrRpc;
//# sourceMappingURL=index.cjs.map
