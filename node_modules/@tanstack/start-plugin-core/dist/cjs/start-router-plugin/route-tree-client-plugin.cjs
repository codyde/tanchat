"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("node:path");
const t = require("@babel/types");
const routerUtils = require("@tanstack/router-utils");
const vite = require("vite");
const babelDeadCodeElimination = require("babel-dead-code-elimination");
const debug = require("../debug.cjs");
const constants = require("../constants.cjs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const t__namespace = /* @__PURE__ */ _interopNamespaceDefault(t);
function routeTreeClientPlugin(config) {
  const generatedRouteTreePath = vite.normalizePath(
    path.resolve(config.generatedRouteTree)
  );
  return {
    name: "tanstack-start:route-tree-client-plugin",
    enforce: "pre",
    // only run this plugin in the client environment
    applyToEnvironment: (env) => env.name === constants.VITE_ENVIRONMENT_NAMES.client,
    transform: {
      filter: { id: generatedRouteTreePath },
      handler(code, id) {
        if (id !== generatedRouteTreePath) {
          return null;
        }
        if (debug.debug) console.info(`Compiling route tree for the client`, id);
        const ast = routerUtils.parseAst({ code, sourceFilename: id });
        const filteredBody = ast.program.body.filter((node) => {
          if (t__namespace.isExportNamedDeclaration(node)) {
            if (node.declaration && t__namespace.isVariableDeclaration(node.declaration) && node.declaration.declarations.length === 1 && node.declaration.declarations[0] && t__namespace.isVariableDeclarator(node.declaration.declarations[0]) && t__namespace.isIdentifier(node.declaration.declarations[0].id) && node.declaration.declarations[0].id.name === "routeTree") {
              return true;
            }
            return false;
          }
          if (t__namespace.isTSInterfaceDeclaration(node) || t__namespace.isTSModuleDeclaration(node)) {
            return false;
          }
          return true;
        });
        ast.program.body = filteredBody;
        babelDeadCodeElimination.deadCodeElimination(ast);
        const compiled = routerUtils.generateFromAst(ast, {
          sourceMaps: true,
          sourceFileName: id,
          filename: id
        });
        if (debug.debug) {
          routerUtils.logDiff(code, compiled.code);
          console.log("Output:\n", compiled.code, "\n\n");
        }
        return compiled;
      }
    }
  };
}
exports.routeTreeClientPlugin = routeTreeClientPlugin;
//# sourceMappingURL=route-tree-client-plugin.cjs.map
