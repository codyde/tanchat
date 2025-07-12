"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const routerCore = require("@tanstack/router-core");
function createServerFileRoute(_) {
  return createServerRoute();
}
function createServerRoute(__, __opts) {
  const options = __opts || {};
  const route = {
    isRoot: false,
    path: "",
    id: "",
    fullPath: "",
    to: "",
    options,
    parentRoute: void 0,
    _types: {},
    // children: undefined as TChildren,
    middleware: (middlewares) => createServerRoute(void 0, {
      ...options,
      middleware: middlewares
    }),
    methods: (methodsOrGetMethods) => {
      const methods = (() => {
        if (typeof methodsOrGetMethods === "function") {
          return methodsOrGetMethods(createMethodBuilder());
        }
        return methodsOrGetMethods;
      })();
      return createServerRoute(void 0, {
        ...__opts,
        methods
      });
    },
    update: (opts) => createServerRoute(void 0, {
      ...options,
      ...opts
    }),
    init: (opts) => {
      var _a;
      options.originalIndex = opts.originalIndex;
      const isRoot = !options.path && !options.id;
      route.parentRoute = (_a = options.getParentRoute) == null ? void 0 : _a.call(options);
      if (isRoot) {
        route.path = routerCore.rootRouteId;
      } else if (!route.parentRoute) {
        throw new Error(
          `Child Route instances must pass a 'getParentRoute: () => ParentRoute' option that returns a ServerRoute instance.`
        );
      }
      let path = isRoot ? routerCore.rootRouteId : options.path;
      if (path && path !== "/") {
        path = routerCore.trimPathLeft(path);
      }
      const customId = options.id || path;
      let id = isRoot ? routerCore.rootRouteId : routerCore.joinPaths([
        route.parentRoute.id === routerCore.rootRouteId ? "" : route.parentRoute.id,
        customId
      ]);
      if (path === routerCore.rootRouteId) {
        path = "/";
      }
      if (id !== routerCore.rootRouteId) {
        id = routerCore.joinPaths(["/", id]);
      }
      const fullPath = id === routerCore.rootRouteId ? "/" : routerCore.joinPaths([route.parentRoute.fullPath, path]);
      route.path = path;
      route.id = id;
      route.fullPath = fullPath;
      route.to = fullPath;
      route.isRoot = isRoot;
    },
    _addFileChildren: (children) => {
      if (Array.isArray(children)) {
        route.children = children;
      }
      if (typeof children === "object" && children !== null) {
        route.children = Object.values(children);
      }
      return route;
    },
    _addFileTypes: () => route
  };
  return route;
}
const createServerRootRoute = createServerRoute;
const createMethodBuilder = (__opts) => {
  return {
    _options: __opts || {},
    _types: {},
    middleware: (middlewares) => createMethodBuilder({
      ...__opts,
      middlewares
    }),
    handler: (handler) => createMethodBuilder({
      ...__opts,
      handler
    })
  };
};
exports.createServerFileRoute = createServerFileRoute;
exports.createServerRootRoute = createServerRootRoute;
exports.createServerRoute = createServerRoute;
//# sourceMappingURL=serverRoute.cjs.map
