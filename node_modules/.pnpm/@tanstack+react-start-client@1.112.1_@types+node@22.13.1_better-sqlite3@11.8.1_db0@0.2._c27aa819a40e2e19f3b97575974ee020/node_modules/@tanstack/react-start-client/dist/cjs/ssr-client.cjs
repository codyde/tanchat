"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const routerCore = require("@tanstack/router-core");
const invariant = require("tiny-invariant");
const serializer = require("./serializer.cjs");
function hydrate(router) {
  var _a, _b, _c;
  invariant(
    (_a = window.__TSR_SSR__) == null ? void 0 : _a.dehydrated,
    "Expected to find a dehydrated data on window.__TSR_SSR__.dehydrated... but we did not. Please file an issue!"
  );
  const { manifest, dehydratedData } = serializer.startSerializer.parse(
    window.__TSR_SSR__.dehydrated
  );
  router.ssr = {
    manifest,
    serializer: serializer.startSerializer
  };
  router.clientSsr = {
    getStreamedValue: (key) => {
      var _a2;
      if (router.isServer) {
        return void 0;
      }
      const streamedValue = (_a2 = window.__TSR_SSR__) == null ? void 0 : _a2.streamedValues[key];
      if (!streamedValue) {
        return;
      }
      if (!streamedValue.parsed) {
        streamedValue.parsed = router.ssr.serializer.parse(streamedValue.value);
      }
      return streamedValue.parsed;
    }
  };
  const matches = router.matchRoutes(router.state.location);
  const routeChunkPromise = Promise.all(
    matches.map((match) => {
      const route = router.looseRoutesById[match.routeId];
      return router.loadRouteChunk(route);
    })
  );
  matches.forEach((match) => {
    var _a2;
    const dehydratedMatch = window.__TSR_SSR__.matches.find(
      (d) => d.id === match.id
    );
    if (dehydratedMatch) {
      Object.assign(match, dehydratedMatch);
      if (dehydratedMatch.__beforeLoadContext) {
        match.__beforeLoadContext = router.ssr.serializer.parse(
          dehydratedMatch.__beforeLoadContext
        );
      }
      if (dehydratedMatch.loaderData) {
        match.loaderData = router.ssr.serializer.parse(
          dehydratedMatch.loaderData
        );
      }
      if (dehydratedMatch.error) {
        match.error = router.ssr.serializer.parse(dehydratedMatch.error);
      }
      (_a2 = match.extracted) == null ? void 0 : _a2.forEach((ex) => {
        deepMutableSetByPath(match, ["loaderData", ...ex.path], ex.value);
      });
    } else {
      Object.assign(match, {
        status: "success",
        updatedAt: Date.now()
      });
    }
    return match;
  });
  router.__store.setState((s) => {
    return {
      ...s,
      matches
    };
  });
  (_c = (_b = router.options).hydrate) == null ? void 0 : _c.call(_b, dehydratedData);
  router.state.matches.forEach((match) => {
    var _a2, _b2, _c2, _d, _e, _f;
    const route = router.looseRoutesById[match.routeId];
    const parentMatch = router.state.matches[match.index - 1];
    const parentContext = (parentMatch == null ? void 0 : parentMatch.context) ?? router.options.context ?? {};
    const contextFnContext = {
      deps: match.loaderDeps,
      params: match.params,
      context: parentContext,
      location: router.state.location,
      navigate: (opts) => router.navigate({ ...opts, _fromLocation: router.state.location }),
      buildLocation: router.buildLocation,
      cause: match.cause,
      abortController: match.abortController,
      preload: false,
      matches
    };
    match.__routeContext = ((_b2 = (_a2 = route.options).context) == null ? void 0 : _b2.call(_a2, contextFnContext)) ?? {};
    match.context = {
      ...parentContext,
      ...match.__routeContext,
      ...match.__beforeLoadContext
    };
    const assetContext = {
      matches: router.state.matches,
      match,
      params: match.params,
      loaderData: match.loaderData
    };
    const headFnContent = (_d = (_c2 = route.options).head) == null ? void 0 : _d.call(_c2, assetContext);
    const scripts = (_f = (_e = route.options).scripts) == null ? void 0 : _f.call(_e, assetContext);
    match.meta = headFnContent == null ? void 0 : headFnContent.meta;
    match.links = headFnContent == null ? void 0 : headFnContent.links;
    match.headScripts = headFnContent == null ? void 0 : headFnContent.scripts;
    match.scripts = scripts;
  });
  return routeChunkPromise;
}
function deepMutableSetByPath(obj, path, value) {
  if (path.length === 1) {
    obj[path[0]] = value;
  }
  const [key, ...rest] = path;
  if (Array.isArray(obj)) {
    deepMutableSetByPath(obj[Number(key)], rest, value);
  } else if (routerCore.isPlainObject(obj)) {
    deepMutableSetByPath(obj[key], rest, value);
  }
}
exports.hydrate = hydrate;
//# sourceMappingURL=ssr-client.cjs.map
