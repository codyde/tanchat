import { serverFnFetcher } from "@tanstack/start-server-functions-fetcher";
import { mergeHeaders } from "@tanstack/start-client-core";
import { getHeaders, getEvent } from "@tanstack/start-server-core";
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createSsrRpc = (functionId, serverBase) => {
  const url = `/${sanitizeBase(serverBase)}/${functionId}`;
  const ssrFn = (...args) => {
    return serverFnFetcher(url, args, async (url2, requestInit) => {
      requestInit.headers = mergeHeaders(getHeaders(), requestInit.headers);
      const res = await $fetch.native(url2, requestInit);
      const event = getEvent();
      const mergedHeaders = mergeHeaders(
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
export {
  createSsrRpc
};
//# sourceMappingURL=index.js.map
