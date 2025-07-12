"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const babel = require("@babel/core");
const types = require("@babel/types");
const codeFrame = require("@babel/code-frame");
const babelDeadCodeElimination = require("babel-dead-code-elimination");
const routerUtils = require("@tanstack/router-utils");
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
const babel__namespace = /* @__PURE__ */ _interopNamespaceDefault(babel);
function buildDirectiveSplitParam(opts) {
  return `tsr-directive-${opts.directive.replace(/[^a-zA-Z0-9]/g, "-")}`;
}
function compileDirectives(opts) {
  const directiveSplitParam = buildDirectiveSplitParam(opts);
  const isDirectiveSplitParam = opts.filename.includes(directiveSplitParam);
  const ast = routerUtils.parseAst(opts);
  const refIdents = babelDeadCodeElimination.findReferencedIdentifiers(ast);
  const directiveFnsById = findDirectives(ast, {
    ...opts,
    directiveSplitParam
  });
  if (Object.keys(directiveFnsById).length > 0) {
    if (opts.getRuntimeCode) {
      const runtimeImport = babel__namespace.template.statement(
        opts.getRuntimeCode({ directiveFnsById })
      )();
      ast.program.body.unshift(runtimeImport);
    }
  }
  if (isDirectiveSplitParam) {
    safeRemoveExports(ast);
    ast.program.body.push(
      babel__namespace.types.exportNamedDeclaration(
        void 0,
        Object.values(directiveFnsById).map(
          (fn) => babel__namespace.types.exportSpecifier(
            babel__namespace.types.identifier(fn.functionName),
            babel__namespace.types.identifier(fn.functionName)
          )
        )
      )
    );
  }
  babelDeadCodeElimination.deadCodeElimination(ast, refIdents);
  const compiledResult = routerUtils.generateFromAst(ast, {
    sourceMaps: true,
    sourceFileName: opts.filename,
    filename: opts.filename
  });
  return {
    compiledResult,
    directiveFnsById,
    isDirectiveSplitParam
  };
}
function findNearestVariableName(path, directiveLabel) {
  let currentPath = path;
  const nameParts = [];
  while (currentPath) {
    const name = (() => {
      var _a;
      if (babel__namespace.types.isFunctionExpression(currentPath.node) && currentPath.node.id) {
        return currentPath.node.id.name;
      }
      if (babel__namespace.types.isCallExpression(currentPath.node)) {
        const current = currentPath.node.callee;
        const chainParts = [];
        if (babel__namespace.types.isMemberExpression(current)) {
          if (babel__namespace.types.isIdentifier(current.property)) {
            chainParts.unshift(current.property.name);
          }
          let base = current.object;
          while (!babel__namespace.types.isIdentifier(base)) {
            if (babel__namespace.types.isCallExpression(base)) {
              base = base.callee;
            } else if (babel__namespace.types.isMemberExpression(base)) {
              base = base.object;
            } else {
              break;
            }
          }
          if (babel__namespace.types.isIdentifier(base)) {
            chainParts.unshift(base.name);
          }
        } else if (babel__namespace.types.isIdentifier(current)) {
          chainParts.unshift(current.name);
        }
        if (chainParts.length > 0) {
          return chainParts.join("_");
        }
      }
      if (babel__namespace.types.isFunctionDeclaration(currentPath.node)) {
        return (_a = currentPath.node.id) == null ? void 0 : _a.name;
      }
      if (babel__namespace.types.isIdentifier(currentPath.node)) {
        return currentPath.node.name;
      }
      if (types.isVariableDeclarator(currentPath.node) && types.isIdentifier(currentPath.node.id)) {
        return currentPath.node.id.name;
      }
      if (babel__namespace.types.isClassMethod(currentPath.node) || babel__namespace.types.isObjectMethod(currentPath.node)) {
        throw new Error(
          `${directiveLabel} in ClassMethod or ObjectMethod not supported`
        );
      }
      return "";
    })();
    if (name) {
      nameParts.unshift(name);
    }
    currentPath = currentPath.parentPath;
  }
  return nameParts.length > 0 ? nameParts.join("_") : "anonymous";
}
function makeFileLocationUrlSafe(location) {
  return location.replace(/[^a-zA-Z0-9-_]/g, "_").replace(/_{2,}/g, "_").replace(/^_|_$/g, "").replace(/_--/g, "--");
}
function makeIdentifierSafe(identifier) {
  return identifier.replace(/[^a-zA-Z0-9_$]/g, "_").replace(/^[0-9]/, "_$&").replace(/^\$/, "_$").replace(/_{2,}/g, "_").replace(/^_|_$/g, "");
}
function findDirectives(ast, opts) {
  const directiveFnsById = {};
  const functionNameSet = /* @__PURE__ */ new Set();
  let programPath;
  babel__namespace.traverse(ast, {
    Program(path) {
      programPath = path;
    }
  });
  const hasFileDirective = ast.program.directives.some(
    (directive) => directive.value.value === opts.directive
  );
  if (hasFileDirective) {
    babel__namespace.traverse(ast, {
      ExportDefaultDeclaration(path) {
        if (babel__namespace.types.isFunctionDeclaration(path.node.declaration)) {
          compileDirective(path.get("declaration"));
        }
      },
      ExportNamedDeclaration(path) {
        if (babel__namespace.types.isFunctionDeclaration(path.node.declaration)) {
          compileDirective(path.get("declaration"));
        }
      },
      ExportDeclaration(path) {
        var _a, _b;
        if (babel__namespace.types.isExportNamedDeclaration(path.node) && babel__namespace.types.isVariableDeclaration(path.node.declaration) && (babel__namespace.types.isFunctionExpression(
          (_a = path.node.declaration.declarations[0]) == null ? void 0 : _a.init
        ) || babel__namespace.types.isArrowFunctionExpression(
          (_b = path.node.declaration.declarations[0]) == null ? void 0 : _b.init
        ))) {
          compileDirective(
            path.get(
              "declaration.declarations.0.init"
            )
          );
        }
      }
    });
  } else {
    babel__namespace.traverse(ast, {
      DirectiveLiteral(nodePath) {
        if (nodePath.node.value === opts.directive) {
          const directiveFn = nodePath.findParent((p) => p.isFunction());
          if (!directiveFn) return;
          const isClassMethod = directiveFn.isClassMethod();
          const isObjectMethod = directiveFn.isObjectMethod();
          if (isClassMethod || isObjectMethod) {
            throw codeFrameError(
              opts.code,
              directiveFn.node.loc,
              `"${opts.directive}" in ${isClassMethod ? "class" : isObjectMethod ? "object method" : ""} not supported`
            );
          }
          const nearestBlock = directiveFn.findParent(
            (p) => (p.isBlockStatement() || p.isScopable()) && !p.isProgram()
          );
          if (nearestBlock) {
            throw codeFrameError(
              opts.code,
              nearestBlock.node.loc,
              `${opts.directiveLabel}s cannot be nested in other blocks or functions`
            );
          }
          if (!directiveFn.isFunctionDeclaration() && !directiveFn.isFunctionExpression() && !(directiveFn.isArrowFunctionExpression() && babel__namespace.types.isBlockStatement(directiveFn.node.body))) {
            throw codeFrameError(
              opts.code,
              directiveFn.node.loc,
              `${opts.directiveLabel}s must be function declarations or function expressions`
            );
          }
          compileDirective(directiveFn);
        }
      }
    });
  }
  return directiveFnsById;
  function compileDirective(directiveFn) {
    const programBody = programPath.node.body;
    if (babel__namespace.types.isFunction(directiveFn.node) && babel__namespace.types.isBlockStatement(directiveFn.node.body)) {
      directiveFn.node.body.directives = directiveFn.node.body.directives.filter(
        (directive) => directive.value.value !== opts.directive
      );
    }
    if (directiveFn.parentPath.isProgram()) {
      if (!babel__namespace.types.isFunctionDeclaration(directiveFn.node)) {
        throw new Error("Top level functions must be function declarations");
      }
      const index = programBody.indexOf(directiveFn.node);
      const originalFunctionName = directiveFn.node.id.name;
      directiveFn.node.id = null;
      const variableDeclaration = babel__namespace.types.variableDeclaration("const", [
        babel__namespace.types.variableDeclarator(
          babel__namespace.types.identifier(originalFunctionName),
          babel__namespace.types.toExpression(directiveFn.node)
        )
      ]);
      directiveFn.replaceWith(variableDeclaration);
      directiveFn = programPath.get(
        `body.${index}.declarations.0.init`
      );
    }
    let functionName = findNearestVariableName(directiveFn, opts.directiveLabel);
    const incrementFunctionNameVersion = (functionName2) => {
      const [realReferenceName, count] = functionName2.split(/_(\d+)$/);
      const resolvedCount = Number(count || "0");
      const suffix = `_${resolvedCount + 1}`;
      return makeIdentifierSafe(realReferenceName) + suffix;
    };
    while (functionNameSet.has(functionName)) {
      functionName = incrementFunctionNameVersion(functionName);
    }
    functionNameSet.add(functionName);
    while (programPath.scope.hasBinding(functionName)) {
      functionName = incrementFunctionNameVersion(functionName);
      programPath.scope.crawl();
    }
    functionNameSet.add(functionName);
    const topParent = directiveFn.findParent((p) => {
      var _a;
      return !!((_a = p.parentPath) == null ? void 0 : _a.isProgram());
    }) || directiveFn;
    const topParentIndex = programBody.indexOf(topParent.node);
    if (directiveFn.parentPath.isProgram()) {
      throw new Error(
        "Top level functions should have already been compiled to variable declarations by this point"
      );
    }
    programBody.splice(
      topParentIndex,
      0,
      babel__namespace.types.variableDeclaration("const", [
        babel__namespace.types.variableDeclarator(
          babel__namespace.types.identifier(functionName),
          babel__namespace.types.toExpression(directiveFn.node)
        )
      ])
    );
    if (babel__namespace.types.isExportNamedDeclaration(directiveFn.parentPath.node) && (babel__namespace.types.isFunctionDeclaration(directiveFn.node) || babel__namespace.types.isFunctionExpression(directiveFn.node)) && babel__namespace.types.isIdentifier(directiveFn.node.id)) {
      const originalFunctionName = directiveFn.node.id.name;
      programBody.splice(
        topParentIndex + 1,
        0,
        babel__namespace.types.exportNamedDeclaration(
          babel__namespace.types.variableDeclaration("const", [
            babel__namespace.types.variableDeclarator(
              babel__namespace.types.identifier(originalFunctionName),
              babel__namespace.types.identifier(functionName)
            )
          ])
        )
      );
      directiveFn.remove();
    } else {
      directiveFn.replaceWith(babel__namespace.types.identifier(functionName));
    }
    directiveFn = programPath.get(
      `body.${topParentIndex}.declarations.0.init`
    );
    const [baseFilename, ..._searchParams] = opts.filename.split("?");
    const searchParams = new URLSearchParams(_searchParams.join("&"));
    searchParams.set(opts.directiveSplitParam, "");
    const extractedFilename = `${baseFilename}?${searchParams.toString()}`;
    const functionId = makeFileLocationUrlSafe(
      `${baseFilename}--${functionName}`.replace(opts.root, "")
    );
    if (opts.replacer) {
      const replacer = opts.replacer({
        fn: "$$fn$$",
        extractedFilename,
        filename: opts.filename,
        functionId,
        isSourceFn: !!opts.directiveSplitParam
      });
      const replacement = babel__namespace.template.expression(replacer, {
        placeholderPattern: false,
        placeholderWhitelist: /* @__PURE__ */ new Set(["$$fn$$"])
      })({
        ...replacer.includes("$$fn$$") ? { $$fn$$: babel__namespace.types.toExpression(directiveFn.node) } : {}
      });
      directiveFn.replaceWith(replacement);
    }
    directiveFnsById[functionId] = {
      nodePath: directiveFn,
      functionName,
      functionId,
      extractedFilename,
      filename: opts.filename,
      chunkName: fileNameToChunkName(opts.root, extractedFilename)
    };
  }
}
function codeFrameError(code, loc, message) {
  if (!loc) {
    return new Error(`${message} at unknown location`);
  }
  const frame = codeFrame.codeFrameColumns(
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
const safeRemoveExports = (ast) => {
  const programBody = ast.program.body;
  const removeExport = (path) => {
    if (babel__namespace.types.isFunctionDeclaration(path.node.declaration) || babel__namespace.types.isClassDeclaration(path.node.declaration) || babel__namespace.types.isVariableDeclaration(path.node.declaration)) {
      if (babel__namespace.types.isFunctionDeclaration(path.node.declaration) || babel__namespace.types.isClassDeclaration(path.node.declaration) || babel__namespace.types.isVariableDeclaration(path.node.declaration)) {
        const insertIndex = programBody.findIndex(
          (node) => node === path.node.declaration
        );
        if (babel__namespace.types.isFunctionDeclaration(path.node.declaration) || babel__namespace.types.isClassDeclaration(path.node.declaration)) {
          if (!path.node.declaration.id) {
            return;
          }
        }
        programBody.splice(insertIndex, 0, path.node.declaration);
      }
    }
    path.remove();
  };
  babel__namespace.traverse(ast, {
    ExportDefaultDeclaration(path) {
      removeExport(path);
    },
    ExportNamedDeclaration(path) {
      removeExport(path);
    }
  });
};
function fileNameToChunkName(root, fileName) {
  return fileName.replace(root, "").replace(/[^a-zA-Z0-9_]/g, "_");
}
exports.compileDirectives = compileDirectives;
exports.findDirectives = findDirectives;
//# sourceMappingURL=compilers.cjs.map
