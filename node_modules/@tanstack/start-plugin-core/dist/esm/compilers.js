import * as babel from "@babel/core";
import * as t from "@babel/types";
import { codeFrameColumns } from "@babel/code-frame";
import { findReferencedIdentifiers, deadCodeElimination } from "babel-dead-code-elimination";
import { parseAst, generateFromAst } from "@tanstack/router-utils";
function compileStartOutputFactory(framework) {
  return function compileStartOutput(opts) {
    const ast = parseAst(opts);
    const doDce = opts.dce ?? true;
    const refIdents = doDce ? findReferencedIdentifiers(ast) : void 0;
    babel.traverse(ast, {
      Program: {
        enter(programPath) {
          const identifiers = {
            createServerRootRoute: {
              name: "createServerRootRoute",
              handleCallExpression: handleCreateServerFileRouteCallExpressionFactory(
                framework,
                "createServerRootRoute"
              ),
              paths: []
            },
            createServerRoute: {
              name: "createServerRoute",
              handleCallExpression: handleCreateServerFileRouteCallExpressionFactory(
                framework,
                "createServerRoute"
              ),
              paths: []
            },
            createServerFileRoute: {
              name: "createServerFileRoute",
              handleCallExpression: handleCreateServerFileRouteCallExpressionFactory(
                framework,
                "createServerFileRoute"
              ),
              paths: []
            },
            createServerFn: {
              name: "createServerFn",
              handleCallExpression: handleCreateServerFnCallExpression,
              paths: []
            },
            createMiddleware: {
              name: "createMiddleware",
              handleCallExpression: handleCreateMiddlewareCallExpression,
              paths: []
            },
            serverOnly: {
              name: "serverOnly",
              handleCallExpression: handleServerOnlyCallExpression,
              paths: []
            },
            clientOnly: {
              name: "clientOnly",
              handleCallExpression: handleClientOnlyCallExpression,
              paths: []
            },
            createIsomorphicFn: {
              name: "createIsomorphicFn",
              handleCallExpression: handleCreateIsomorphicFnCallExpression,
              paths: []
            }
          };
          const identifierKeys = Object.keys(identifiers);
          programPath.traverse({
            ImportDeclaration: (path) => {
              if (path.node.source.value !== `@tanstack/${framework}-start`) {
                return;
              }
              path.node.specifiers.forEach((specifier) => {
                identifierKeys.forEach((identifierKey) => {
                  const identifier = identifiers[identifierKey];
                  if (specifier.type === "ImportSpecifier" && specifier.imported.type === "Identifier") {
                    if (specifier.imported.name === identifierKey) {
                      identifier.name = specifier.local.name;
                    }
                  }
                  if (specifier.type === "ImportNamespaceSpecifier") {
                    identifier.name = `${specifier.local.name}.${identifierKey}`;
                  }
                });
              });
            },
            CallExpression: (path) => {
              identifierKeys.forEach((identifierKey) => {
                var _a;
                if (t.isIdentifier(path.node.callee) && path.node.callee.name === identifiers[identifierKey].name) {
                  if (((_a = path.scope.getBinding(identifiers[identifierKey].name)) == null ? void 0 : _a.path.node.type) === "FunctionDeclaration") {
                    return;
                  }
                  return identifiers[identifierKey].paths.push(path);
                }
                if (t.isMemberExpression(path.node.callee)) {
                  if (t.isIdentifier(path.node.callee.object) && t.isIdentifier(path.node.callee.property)) {
                    const callname = [
                      path.node.callee.object.name,
                      path.node.callee.property.name
                    ].join(".");
                    if (callname === identifiers[identifierKey].name) {
                      identifiers[identifierKey].paths.push(path);
                    }
                  }
                }
                return;
              });
            }
          });
          identifierKeys.forEach((identifierKey) => {
            identifiers[identifierKey].paths.forEach((path) => {
              identifiers[identifierKey].handleCallExpression(
                path,
                opts
              );
            });
          });
        }
      }
    });
    if (doDce) {
      deadCodeElimination(ast, refIdents);
    }
    return generateFromAst(ast, {
      sourceMaps: true,
      sourceFileName: opts.filename,
      filename: opts.filename
    });
  };
}
function handleCreateServerFileRouteCallExpressionFactory(factory, method) {
  return function handleCreateServerFileRouteCallExpression(path, opts) {
    const PACKAGES = { start: `@tanstack/${factory}-start/server` };
    let highestParent = path;
    while (highestParent.parentPath && !highestParent.parentPath.isProgram()) {
      highestParent = highestParent.parentPath;
    }
    const programPath = highestParent.parentPath;
    if (opts.env === "client") {
      highestParent.remove();
      return;
    }
    let isCreateServerFileRouteImported = false;
    programPath.traverse({
      ImportDeclaration(importPath) {
        const importSource = importPath.node.source.value;
        if (importSource === PACKAGES.start) {
          const specifiers = importPath.node.specifiers;
          isCreateServerFileRouteImported || (isCreateServerFileRouteImported = specifiers.some((specifier) => {
            return t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported) && specifier.imported.name === method;
          }));
        }
      }
    });
    if (!isCreateServerFileRouteImported) {
      const importDeclaration = t.importDeclaration(
        [t.importSpecifier(t.identifier(method), t.identifier(method))],
        t.stringLiteral(PACKAGES.start)
      );
      programPath.node.body.unshift(importDeclaration);
    }
  };
}
const handleServerOnlyCallExpression = buildEnvOnlyCallExpressionHandler("server");
const handleClientOnlyCallExpression = buildEnvOnlyCallExpressionHandler("client");
function handleCreateServerFnCallExpression(path, opts) {
  var _a;
  const calledOptions = path.node.arguments[0] ? path.get("arguments.0") : null;
  const shouldValidateClient = !!(calledOptions == null ? void 0 : calledOptions.node.properties.find((prop) => {
    return t.isObjectProperty(prop) && t.isIdentifier(prop.key) && prop.key.name === "validateClient" && t.isBooleanLiteral(prop.value) && prop.value.value === true;
  }));
  const callExpressionPaths = {
    middleware: null,
    validator: null,
    handler: null
  };
  const validMethods = Object.keys(callExpressionPaths);
  const rootCallExpression = getRootCallExpression(path);
  if (!rootCallExpression.parentPath.isVariableDeclarator()) {
    throw new Error("createServerFn must be assigned to a variable!");
  }
  const variableDeclarator = rootCallExpression.parentPath.node;
  const existingVariableName = variableDeclarator.id.name;
  rootCallExpression.traverse({
    MemberExpression(memberExpressionPath) {
      if (t.isIdentifier(memberExpressionPath.node.property)) {
        const name = memberExpressionPath.node.property.name;
        if (validMethods.includes(name) && memberExpressionPath.parentPath.isCallExpression()) {
          callExpressionPaths[name] = memberExpressionPath.parentPath;
        }
      }
    }
  });
  if (callExpressionPaths.validator) {
    const innerInputExpression = callExpressionPaths.validator.node.arguments[0];
    if (!innerInputExpression) {
      throw new Error(
        "createServerFn().validator() must be called with a validator!"
      );
    }
    if (opts.env === "client" && !shouldValidateClient && t.isMemberExpression(callExpressionPaths.validator.node.callee)) {
      callExpressionPaths.validator.replaceWith(
        callExpressionPaths.validator.node.callee.object
      );
    }
  }
  const handlerFnPath = (_a = callExpressionPaths.handler) == null ? void 0 : _a.get(
    "arguments.0"
  );
  if (!callExpressionPaths.handler || !handlerFnPath.node) {
    throw codeFrameError(
      opts.code,
      path.node.callee.loc,
      `createServerFn must be called with a "handler" property!`
    );
  }
  const handlerFn = handlerFnPath.node;
  if (t.isIdentifier(handlerFn)) {
    if (opts.env === "client") {
      const binding = handlerFnPath.scope.getBinding(handlerFn.name);
      if (binding) {
        binding.path.remove();
      }
    }
  }
  handlerFnPath.replaceWith(
    t.arrowFunctionExpression(
      [t.identifier("opts"), t.identifier("signal")],
      t.blockStatement(
        // Everything in here is server-only, since the client
        // will strip out anything in the 'use server' directive.
        [
          t.returnStatement(
            t.callExpression(
              t.identifier(`${existingVariableName}.__executeServer`),
              [t.identifier("opts"), t.identifier("signal")]
            )
          )
        ],
        [t.directive(t.directiveLiteral("use server"))]
      )
    )
  );
  if (opts.env === "server") {
    callExpressionPaths.handler.node.arguments.push(handlerFn);
  }
}
function handleCreateMiddlewareCallExpression(path, opts) {
  var _a;
  const rootCallExpression = getRootCallExpression(path);
  const callExpressionPaths = {
    middleware: null,
    validator: null,
    client: null,
    server: null
  };
  const validMethods = Object.keys(callExpressionPaths);
  rootCallExpression.traverse({
    MemberExpression(memberExpressionPath) {
      if (t.isIdentifier(memberExpressionPath.node.property)) {
        const name = memberExpressionPath.node.property.name;
        if (validMethods.includes(name) && memberExpressionPath.parentPath.isCallExpression()) {
          callExpressionPaths[name] = memberExpressionPath.parentPath;
        }
      }
    }
  });
  if (callExpressionPaths.validator) {
    const innerInputExpression = callExpressionPaths.validator.node.arguments[0];
    if (!innerInputExpression) {
      throw new Error(
        "createMiddleware().validator() must be called with a validator!"
      );
    }
    if (opts.env === "client") {
      if (t.isMemberExpression(callExpressionPaths.validator.node.callee)) {
        callExpressionPaths.validator.replaceWith(
          callExpressionPaths.validator.node.callee.object
        );
      }
    }
  }
  const serverFnPath = (_a = callExpressionPaths.server) == null ? void 0 : _a.get(
    "arguments.0"
  );
  if (callExpressionPaths.server && serverFnPath.node && opts.env === "client") {
    if (t.isMemberExpression(callExpressionPaths.server.node.callee)) {
      callExpressionPaths.server.replaceWith(
        callExpressionPaths.server.node.callee.object
      );
    }
  }
}
function buildEnvOnlyCallExpressionHandler(env) {
  return function envOnlyCallExpressionHandler(path, opts) {
    const isEnvMatch = env === "client" ? opts.env === "client" : opts.env === "server";
    if (isEnvMatch) {
      const innerInputExpression = path.node.arguments[0];
      if (!t.isExpression(innerInputExpression)) {
        throw new Error(
          `${env}Only() functions must be called with a function!`
        );
      }
      path.replaceWith(innerInputExpression);
      return;
    }
    path.replaceWith(
      t.arrowFunctionExpression(
        [],
        t.blockStatement([
          t.throwStatement(
            t.newExpression(t.identifier("Error"), [
              t.stringLiteral(
                `${env}Only() functions can only be called on the ${env}!`
              )
            ])
          )
        ])
      )
    );
  };
}
function handleCreateIsomorphicFnCallExpression(path, opts) {
  const rootCallExpression = getRootCallExpression(path);
  const callExpressionPaths = {
    client: null,
    server: null
  };
  const validMethods = Object.keys(callExpressionPaths);
  rootCallExpression.traverse({
    MemberExpression(memberExpressionPath) {
      if (t.isIdentifier(memberExpressionPath.node.property)) {
        const name = memberExpressionPath.node.property.name;
        if (validMethods.includes(name) && memberExpressionPath.parentPath.isCallExpression()) {
          callExpressionPaths[name] = memberExpressionPath.parentPath;
        }
      }
    }
  });
  if (validMethods.every(
    (method) => !callExpressionPaths[method]
  )) {
    const variableId = rootCallExpression.parentPath.isVariableDeclarator() ? rootCallExpression.parentPath.node.id : null;
    console.warn(
      "createIsomorphicFn called without a client or server implementation!",
      "This will result in a no-op function.",
      "Variable name:",
      t.isIdentifier(variableId) ? variableId.name : "unknown"
    );
  }
  const envCallExpression = callExpressionPaths[opts.env];
  if (!envCallExpression) {
    rootCallExpression.replaceWith(
      t.arrowFunctionExpression([], t.blockStatement([]))
    );
    return;
  }
  const innerInputExpression = envCallExpression.node.arguments[0];
  if (!t.isExpression(innerInputExpression)) {
    throw new Error(
      `createIsomorphicFn().${opts.env}(func) must be called with a function!`
    );
  }
  rootCallExpression.replaceWith(innerInputExpression);
}
function getRootCallExpression(path) {
  let rootCallExpression = path;
  while (rootCallExpression.parentPath.isMemberExpression()) {
    const parent = rootCallExpression.parentPath;
    if (parent.parentPath.isCallExpression()) {
      rootCallExpression = parent.parentPath;
    }
  }
  return rootCallExpression;
}
function codeFrameError(code, loc, message) {
  const frame = codeFrameColumns(
    code,
    {
      start: loc.start,
      end: loc.end
    },
    {
      highlightCode: true,
      message
    }
  );
  return new Error(frame);
}
export {
  compileStartOutputFactory,
  getRootCallExpression,
  handleClientOnlyCallExpression,
  handleCreateIsomorphicFnCallExpression,
  handleCreateMiddlewareCallExpression,
  handleCreateServerFnCallExpression,
  handleServerOnlyCallExpression
};
//# sourceMappingURL=compilers.js.map
