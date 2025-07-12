"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const utils = require("./utils.cjs");
function fillTemplate(config, template, values) {
  const replaced = template.replace(
    /%%(\w+)%%/g,
    (_, key) => values[key] || ""
  );
  return utils.format(replaced, config);
}
function getTargetTemplate(target) {
  switch (target) {
    // TODO: Remove this disabled eslint rule when more target types are added.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case "react":
      return {
        fullPkg: "@tanstack/react-router",
        subPkg: "react-router",
        rootRoute: {
          template: () => [
            'import * as React from "react"\n',
            "%%tsrImports%%",
            "\n\n",
            "%%tsrExportStart%%{\n component: RootComponent\n }%%tsrExportEnd%%\n\n",
            'function RootComponent() { return (<React.Fragment><div>Hello "%%tsrPath%%"!</div><Outlet /></React.Fragment>) };\n'
          ].join(""),
          imports: {
            tsrImports: () => "import { Outlet, createRootRoute } from '@tanstack/react-router';",
            tsrExportStart: () => "export const Route = createRootRoute(",
            tsrExportEnd: () => ");"
          }
        },
        route: {
          template: () => [
            "%%tsrImports%%",
            "\n\n",
            "%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n",
            'function RouteComponent() { return <div>Hello "%%tsrPath%%"!</div> };\n'
          ].join(""),
          imports: {
            tsrImports: () => "import { createFileRoute } from '@tanstack/react-router';",
            tsrExportStart: (routePath) => `export const Route = createFileRoute('${routePath}')(`,
            tsrExportEnd: () => ");"
          }
        },
        lazyRoute: {
          template: () => [
            "%%tsrImports%%",
            "\n\n",
            "%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n",
            'function RouteComponent() { return <div>Hello "%%tsrPath%%"!</div> };\n'
          ].join(""),
          imports: {
            tsrImports: () => "import { createLazyFileRoute } from '@tanstack/react-router';",
            tsrExportStart: (routePath) => `export const Route = createLazyFileRoute('${routePath}')(`,
            tsrExportEnd: () => ");"
          }
        }
      };
    case "solid":
      return {
        fullPkg: "@tanstack/solid-router",
        subPkg: "solid-router",
        rootRoute: {
          template: () => [
            'import * as Solid from "solid-js"\n',
            "%%tsrImports%%",
            "\n\n",
            "%%tsrExportStart%%{\n component: RootComponent\n }%%tsrExportEnd%%\n\n",
            'function RootComponent() { return (<><div>Hello "%%tsrPath%%"!</div><Outlet /></>) };\n'
          ].join(""),
          imports: {
            tsrImports: () => "import { Outlet, createRootRoute } from '@tanstack/solid-router';",
            tsrExportStart: () => "export const Route = createRootRoute(",
            tsrExportEnd: () => ");"
          }
        },
        route: {
          template: () => [
            "%%tsrImports%%",
            "\n\n",
            "%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n",
            'function RouteComponent() { return <div>Hello "%%tsrPath%%"!</div> };\n'
          ].join(""),
          imports: {
            tsrImports: () => "import { createFileRoute } from '@tanstack/solid-router';",
            tsrExportStart: (routePath) => `export const Route = createFileRoute('${routePath}')(`,
            tsrExportEnd: () => ");"
          }
        },
        lazyRoute: {
          template: () => [
            "%%tsrImports%%",
            "\n\n",
            "%%tsrExportStart%%{\n component: RouteComponent\n }%%tsrExportEnd%%\n\n",
            'function RouteComponent() { return <div>Hello "%%tsrPath%%"!</div> };\n'
          ].join(""),
          imports: {
            tsrImports: () => "import { createLazyFileRoute } from '@tanstack/solid-router';",
            tsrExportStart: (routePath) => `export const Route = createLazyFileRoute('${routePath}')(`,
            tsrExportEnd: () => ");"
          }
        }
      };
    default:
      throw new Error(`router-generator: Unknown target type: ${target}`);
  }
}
const defaultAPIRouteTemplate = [
  'import { json } from "@tanstack/react-start";\n',
  "%%tsrImports%%",
  "\n\n",
  `%%tsrExportStart%%{ GET: ({ request, params }) => { return json({ message:'Hello "%%tsrPath%%"!' }) }}%%tsrExportEnd%%
`
].join("");
exports.defaultAPIRouteTemplate = defaultAPIRouteTemplate;
exports.fillTemplate = fillTemplate;
exports.getTargetTemplate = getTargetTemplate;
//# sourceMappingURL=template.cjs.map
