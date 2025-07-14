import { hasChildWithExport, checkRouteFullPathUniqueness, ensureStringArgument } from "@tanstack/router-generator";
const EXPORT_NAME = "ServerRoute";
function serverRoutesPlugin() {
  return {
    name: "server-routes-plugin",
    transformPlugin: {
      name: "server-routes-transform",
      exportName: EXPORT_NAME,
      imports: (ctx) => {
        const targetModule = `@tanstack/${ctx.target}-start/server`;
        const imports = {};
        if (ctx.verboseFileRoutes === false) {
          imports.banned = [
            {
              source: targetModule,
              specifiers: [{ imported: "createServerFileRoute" }]
            }
          ];
        } else {
          imports.required = [
            {
              source: targetModule,
              specifiers: [{ imported: "createServerFileRoute" }]
            }
          ];
        }
        return imports;
      },
      onExportFound: ({ ctx, decl }) => {
        var _a;
        let appliedChanges = false;
        if (((_a = decl.init) == null ? void 0 : _a.type) === "CallExpression") {
          let call = decl.init;
          let callee = call.callee;
          while (callee.type === "MemberExpression" && callee.object.type === "CallExpression") {
            call = callee.object;
            callee = call.callee;
          }
          if (call.callee.type === "Identifier" && call.callee.name === "createServerFileRoute") {
            if (!ctx.verboseFileRoutes) {
              if (call.arguments.length) {
                call.arguments = [];
                appliedChanges = true;
              }
            } else {
              appliedChanges = ensureStringArgument(
                call,
                ctx.routeId,
                ctx.preferredQuote
              );
            }
          } else {
            throw new Error(
              `Expected "createServerFileRoute" call, but got "${call.callee.type}"`
            );
          }
        }
        return appliedChanges;
      }
    },
    moduleAugmentation: ({ generator }) => ({
      module: `@tanstack/${generator.config.target}-start/server`,
      interfaceName: "ServerFileRoutesByPath"
    }),
    onRouteTreesChanged: ({ routeTrees, generator }) => {
      const tree = routeTrees.find((tree2) => tree2.exportName === EXPORT_NAME);
      if (tree) {
        checkRouteFullPathUniqueness(tree.sortedRouteNodes, generator.config);
      }
    },
    imports: (ctx) => {
      var _a;
      const imports = [];
      const targetModule = `@tanstack/${ctx.generator.config.target}-start/server`;
      if (ctx.generator.config.verboseFileRoutes === false) {
        imports.push({
          specifiers: [
            { imported: "CreateServerFileRoute" },
            { imported: "ServerFileRoutesByPath" }
          ],
          source: targetModule,
          importKind: "type"
        });
      }
      const hasMatchingRouteFiles = ctx.acc.routeNodes.length > 0;
      if (hasMatchingRouteFiles) {
        if (!((_a = ctx.rootRouteNode.exports) == null ? void 0 : _a.includes(EXPORT_NAME))) {
          imports.push({
            specifiers: [{ imported: "createServerRootRoute" }],
            source: targetModule
          });
        }
      }
      return imports;
    },
    routeModuleAugmentation: ({ routeNode }) => {
      if (routeNode._fsRouteType === "lazy") {
        return void 0;
      }
      return `const createServerFileRoute: CreateServerFileRoute<
          ServerFileRoutesByPath['${routeNode.routePath}']['parentRoute'],
          ServerFileRoutesByPath['${routeNode.routePath}']['id'],
          ServerFileRoutesByPath['${routeNode.routePath}']['path'],
          ServerFileRoutesByPath['${routeNode.routePath}']['fullPath'],
          ${hasChildWithExport(routeNode, "ServerRoute") ? `${routeNode.variableName}ServerRouteChildren` : "unknown"}
        >`;
    },
    createRootRouteCode: () => `createServerRootRoute()`,
    createVirtualRouteCode: ({ node }) => `createServerFileRoute('${node.routePath}')`,
    config: ({ sortedRouteNodes }) => {
      const hasMatchingRouteFiles = sortedRouteNodes.length > 0;
      return {
        virtualRootRoute: hasMatchingRouteFiles
      };
    }
  };
}
export {
  serverRoutesPlugin
};
//# sourceMappingURL=server-routes-plugin.js.map
