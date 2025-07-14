"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startServerFunctionsFetcher = require("@tanstack/start-server-functions-fetcher");
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createClientRpc = (functionId, serverBase) => {
  const sanitizedAppBase = sanitizeBase(process.env.TSS_APP_BASE || "/");
  const sanitizedServerBase = sanitizeBase(serverBase);
  const url = `${sanitizedAppBase ? `/${sanitizedAppBase}` : ``}/${sanitizedServerBase}/${functionId}`;
  const clientFn = (...args) => {
    return startServerFunctionsFetcher.serverFnFetcher(url, args, fetch);
  };
  return Object.assign(clientFn, {
    url,
    functionId
  });
};
exports.createClientRpc = createClientRpc;
//# sourceMappingURL=index.cjs.map
