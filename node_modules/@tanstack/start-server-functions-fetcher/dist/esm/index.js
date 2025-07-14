import { isPlainObject, encode, parseRedirect, isRedirect, isNotFound } from "@tanstack/router-core";
import { startSerializer } from "@tanstack/start-client-core";
async function serverFnFetcher(url, args, handler) {
  const _first = args[0];
  if (isPlainObject(_first) && _first.method) {
    const first = _first;
    const type = first.data instanceof FormData ? "formData" : "payload";
    const headers = new Headers({
      "x-tsr-redirect": "manual",
      ...type === "payload" ? {
        "content-type": "application/json",
        accept: "application/json"
      } : {},
      ...first.headers instanceof Headers ? Object.fromEntries(first.headers.entries()) : first.headers
    });
    if (first.method === "GET") {
      const encodedPayload = encode({
        payload: startSerializer.stringify({
          data: first.data,
          context: first.context
        })
      });
      if (encodedPayload) {
        if (url.includes("?")) {
          url += `&${encodedPayload}`;
        } else {
          url += `?${encodedPayload}`;
        }
      }
    }
    if (url.includes("?")) {
      url += `&createServerFn`;
    } else {
      url += `?createServerFn`;
    }
    if (first.response === "raw") {
      url += `&raw`;
    }
    return await getResponse(
      () => handler(url, {
        method: first.method,
        headers,
        signal: first.signal,
        ...getFetcherRequestOptions(first)
      })
    );
  }
  return await getResponse(
    () => handler(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(args),
      redirect: "manual"
    })
  );
}
function getFetcherRequestOptions(opts) {
  if (opts.method === "POST") {
    if (opts.data instanceof FormData) {
      opts.data.set("__TSR_CONTEXT", startSerializer.stringify(opts.context));
      return {
        body: opts.data
      };
    }
    return {
      body: startSerializer.stringify({
        data: opts.data ?? null,
        context: opts.context
      })
    };
  }
  return {};
}
async function getResponse(fn) {
  var _a;
  const response = await (async () => {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      throw error;
    }
  })();
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    if (isJson) {
      throw startSerializer.decode(await response.json());
    }
    throw new Error(await response.text());
  }
  if ((_a = response.headers.get("content-type")) == null ? void 0 : _a.includes("application/json")) {
    let json = startSerializer.decode(await response.json());
    const redirect = parseRedirect(json);
    if (redirect) json = redirect;
    if (isRedirect(json) || isNotFound(json) || json instanceof Error) {
      throw json;
    }
    return json;
  }
  return response;
}
export {
  serverFnFetcher
};
//# sourceMappingURL=index.js.map
