import { serverFnFetcher } from "@tanstack/start-server-functions-fetcher";
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createClientRpc = (functionId, serverBase) => {
  const sanitizedAppBase = sanitizeBase(process.env.TSS_APP_BASE || "/");
  const sanitizedServerBase = sanitizeBase(serverBase);
  const url = `${sanitizedAppBase ? `/${sanitizedAppBase}` : ``}/${sanitizedServerBase}/${functionId}`;
  const clientFn = (...args) => {
    return serverFnFetcher(url, args, fetch);
  };
  return Object.assign(clientFn, {
    url,
    functionId
  });
};
export {
  createClientRpc
};
//# sourceMappingURL=index.js.map
