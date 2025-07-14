import { isRedirect, isNotFound } from "@tanstack/router-core";
import invariant from "tiny-invariant";
import { eventHandler, toWebRequest, getResponseStatus, getEvent } from "@tanstack/start-server-core";
import { startSerializer } from "@tanstack/start-client-core";
import _serverFnManifest from "tsr:server-fn-manifest";
const dummy = 1;
const index = eventHandler(handleServerAction);
const serverFnManifest = _serverFnManifest;
async function handleServerAction(event) {
  const request = toWebRequest(event);
  const response = await handleServerRequest({
    request,
    event
  });
  return response;
}
function sanitizeBase(base) {
  if (!base) {
    throw new Error(
      "🚨 process.env.TSS_SERVER_FN_BASE is required in start/server-handler/index"
    );
  }
  return base.replace(/^\/|\/$/g, "");
}
async function handleServerRequest({
  request,
  event
}) {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  event.node.req.on("close", abort);
  const method = request.method;
  const url = new URL(request.url, "http://localhost:3000");
  const regex = new RegExp(
    `${sanitizeBase(process.env.TSS_SERVER_FN_BASE)}/([^/?#]+)`
  );
  const match = url.pathname.match(regex);
  const serverFnId = match ? match[1] : null;
  const search = Object.fromEntries(url.searchParams.entries());
  const isCreateServerFn = "createServerFn" in search;
  const isRaw = "raw" in search;
  if (typeof serverFnId !== "string") {
    throw new Error("Invalid server action param for serverFnId: " + serverFnId);
  }
  const serverFnInfo = serverFnManifest[serverFnId];
  if (!serverFnInfo) {
    console.log("serverFnManifest", serverFnManifest);
    throw new Error("Server function info not found for " + serverFnId);
  }
  if (process.env.NODE_ENV === "development")
    console.info(`
ServerFn Request: ${serverFnId}`);
  let fnModule;
  if (process.env.NODE_ENV === "development") {
    fnModule = await globalThis.app.getRouter("server").internals.devServer.ssrLoadModule(serverFnInfo.extractedFilename);
  } else {
    fnModule = await serverFnInfo.importer();
  }
  if (!fnModule) {
    console.log("serverFnManifest", serverFnManifest);
    throw new Error("Server function module not resolved for " + serverFnId);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.log("serverFnManifest", serverFnManifest);
    console.log("fnModule", fnModule);
    throw new Error(
      `Server function module export not resolved for serverFn ID: ${serverFnId}`
    );
  }
  const formDataContentTypes = [
    "multipart/form-data",
    "application/x-www-form-urlencoded"
  ];
  const response = await (async () => {
    try {
      let result = await (async () => {
        if (request.headers.get("Content-Type") && formDataContentTypes.some(
          (type) => {
            var _a;
            return (_a = request.headers.get("Content-Type")) == null ? void 0 : _a.includes(type);
          }
        )) {
          invariant(
            method.toLowerCase() !== "get",
            "GET requests with FormData payloads are not supported"
          );
          return await action(await request.formData(), signal);
        }
        if (method.toLowerCase() === "get") {
          let payload2 = search;
          if (isCreateServerFn) {
            payload2 = search.payload;
          }
          payload2 = payload2 ? startSerializer.parse(payload2) : payload2;
          return await action(payload2, signal);
        }
        const jsonPayloadAsString = await request.text();
        const payload = startSerializer.parse(jsonPayloadAsString);
        if (isCreateServerFn) {
          return await action(payload, signal);
        }
        return await action(...payload, signal);
      })();
      if (result.result instanceof Response) {
        return result.result;
      }
      if (!isCreateServerFn) {
        result = result.result;
        if (result instanceof Response) {
          return result;
        }
      }
      if (isRedirect(result) || isNotFound(result)) {
        return redirectOrNotFoundResponse(result);
      }
      return new Response(
        result !== void 0 ? startSerializer.stringify(result) : void 0,
        {
          status: getResponseStatus(getEvent()),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isRedirect(error) || isNotFound(error)) {
        return redirectOrNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      return new Response(startSerializer.stringify(error), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  })();
  event.node.req.removeListener("close", abort);
  if (isRaw) {
    return response;
  }
  if (process.env.NODE_ENV === "development")
    console.info(`ServerFn Response: ${response.status}`);
  if (response.headers.get("Content-Type") === "application/json") {
    const cloned = response.clone();
    const text = await cloned.text();
    const payload = text ? JSON.stringify(JSON.parse(text)) : "undefined";
    if (process.env.NODE_ENV === "development")
      console.info(
        ` - Payload: ${payload.length > 100 ? payload.substring(0, 100) + "..." : payload}`
      );
  }
  if (process.env.NODE_ENV === "development") console.info();
  return response;
}
function redirectOrNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
export {
  index as default,
  dummy
};
//# sourceMappingURL=index.js.map
