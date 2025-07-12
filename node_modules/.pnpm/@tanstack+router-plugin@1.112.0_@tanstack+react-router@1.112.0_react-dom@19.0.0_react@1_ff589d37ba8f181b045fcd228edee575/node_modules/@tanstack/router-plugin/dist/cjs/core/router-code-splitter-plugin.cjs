"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_path = require("node:path");
const node_url = require("node:url");
const routerUtils = require("@tanstack/router-utils");
const config = require("./config.cjs");
const compilers = require("./code-splitter/compilers.cjs");
const constants = require("./constants.cjs");
const pathIds = require("./code-splitter/path-ids.cjs");
const debug = process.env.TSR_VITE_DEBUG && ["true", "router-plugin"].includes(process.env.TSR_VITE_DEBUG);
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function fileIsInRoutesDirectory(filePath, routesDirectory) {
  const routesDirectoryPath = node_path.isAbsolute(routesDirectory) ? routesDirectory : node_path.join(process.cwd(), routesDirectory);
  const path = node_path.normalize(filePath);
  return path.startsWith(routesDirectoryPath);
}
const bannedBeforeExternalPlugins = [
  {
    identifier: "@react-refresh",
    pkg: "@vitejs/plugin-react",
    usage: "viteReact()",
    frameworks: ["vite"]
  }
];
class FoundPluginInBeforeCode extends Error {
  constructor(externalPlugin, framework) {
    super(`We detected that the '${externalPlugin.pkg}' was passed before '@tanstack/router-plugin'. Please make sure that '@tanstack/router-plugin' is passed before '${externalPlugin.pkg}' and try again: 
e.g.
plugins: [
  TanStackRouter${capitalizeFirst(framework)}(), // Place this before ${externalPlugin.usage}
  ${externalPlugin.usage},
]
`);
  }
}
const PLUGIN_NAME = "unplugin:router-code-splitter";
const unpluginRouterCodeSplitterFactory = (options = {}, { framework }) => {
  let ROOT = process.cwd();
  let userConfig = options;
  const isProduction = process.env.NODE_ENV === "production";
  const getGlobalCodeSplitGroupings = () => {
    var _a;
    return ((_a = userConfig.codeSplittingOptions) == null ? void 0 : _a.defaultBehavior) || constants.defaultCodeSplitGroupings;
  };
  const getShouldSplitFn = () => {
    var _a;
    return (_a = userConfig.codeSplittingOptions) == null ? void 0 : _a.splitBehavior;
  };
  const handleCompilingReferenceFile = (code, id) => {
    if (debug) console.info("Compiling Route: ", id);
    const fromCode = compilers.detectCodeSplitGroupingsFromRoute({
      code,
      root: ROOT,
      filename: id
    });
    if (fromCode.groupings) {
      const res = config.splitGroupingsSchema.safeParse(fromCode.groupings);
      if (!res.success) {
        const message = res.error.errors.map((e) => e.message).join(". ");
        throw new Error(
          `The groupings for the route "${id}" are invalid.
${message}`
        );
      }
    }
    const userShouldSplitFn = getShouldSplitFn();
    const pluginSplitBehavior = userShouldSplitFn == null ? void 0 : userShouldSplitFn({
      routeId: fromCode.routeId
    });
    if (pluginSplitBehavior) {
      const res = config.splitGroupingsSchema.safeParse(pluginSplitBehavior);
      if (!res.success) {
        const message = res.error.errors.map((e) => e.message).join(". ");
        throw new Error(
          `The groupings returned when using \`splitBehavior\` for the route "${id}" are invalid.
${message}`
        );
      }
    }
    const splitGroupings = fromCode.groupings || pluginSplitBehavior || getGlobalCodeSplitGroupings();
    const compiledReferenceRoute = compilers.compileCodeSplitReferenceRoute({
      code,
      root: ROOT,
      filename: id,
      runtimeEnv: isProduction ? "prod" : "dev",
      codeSplitGroupings: splitGroupings,
      targetFramework: userConfig.target
    });
    if (debug) {
      routerUtils.logDiff(code, compiledReferenceRoute.code);
      console.log("Output:\n", compiledReferenceRoute.code + "\n\n");
    }
    return compiledReferenceRoute;
  };
  const handleCompilingVirtualFile = (code, id) => {
    if (debug) console.info("Splitting Route: ", id);
    const [_, ...pathnameParts] = id.split("?");
    const searchParams = new URLSearchParams(pathnameParts.join("?"));
    const splitValue = searchParams.get(constants.tsrSplit);
    if (!splitValue) {
      throw new Error(
        `The split value for the virtual route "${id}" was not found.`
      );
    }
    const rawGrouping = pathIds.decodeIdentifier(splitValue);
    const grouping = [...new Set(rawGrouping)].filter(
      (p) => constants.splitRouteIdentNodes.includes(p)
    );
    const result = compilers.compileCodeSplitVirtualRoute({
      code,
      root: ROOT,
      filename: id,
      splitTargets: grouping
    });
    if (debug) {
      routerUtils.logDiff(code, result.code);
      console.log("Output:\n", result.code + "\n\n");
    }
    return result;
  };
  return {
    name: "router-code-splitter-plugin",
    enforce: "pre",
    transform(code, id) {
      if (!userConfig.autoCodeSplitting) {
        return null;
      }
      const url = node_url.pathToFileURL(id);
      url.searchParams.delete("v");
      id = node_url.fileURLToPath(url).replace(/\\/g, "/");
      if (id.includes(constants.tsrSplit)) {
        return handleCompilingVirtualFile(code, id);
      } else if (fileIsInRoutesDirectory(id, userConfig.routesDirectory) && (code.includes("createRoute(") || code.includes("createFileRoute("))) {
        for (const externalPlugin of bannedBeforeExternalPlugins) {
          if (!externalPlugin.frameworks.includes(framework)) {
            continue;
          }
          if (code.includes(externalPlugin.identifier)) {
            throw new FoundPluginInBeforeCode(externalPlugin, framework);
          }
        }
        return handleCompilingReferenceFile(code, id);
      }
      return null;
    },
    transformInclude(id) {
      if (!userConfig.autoCodeSplitting) {
        return void 0;
      }
      if (fileIsInRoutesDirectory(id, userConfig.routesDirectory) || id.includes(constants.tsrSplit)) {
        return true;
      }
      return false;
    },
    vite: {
      configResolved(config$1) {
        ROOT = config$1.root;
        userConfig = config.getConfig(options, ROOT);
      }
    },
    rspack(_compiler) {
      ROOT = process.cwd();
      userConfig = config.getConfig(options, ROOT);
    },
    webpack(compiler) {
      ROOT = process.cwd();
      userConfig = config.getConfig(options, ROOT);
      if (userConfig.autoCodeSplitting && compiler.options.mode === "production") {
        compiler.hooks.done.tap(PLUGIN_NAME, () => {
          console.info("✅ " + PLUGIN_NAME + ": code-splitting done!");
          setTimeout(() => {
            process.exit(0);
          });
        });
      }
    }
  };
};
exports.unpluginRouterCodeSplitterFactory = unpluginRouterCodeSplitterFactory;
//# sourceMappingURL=router-code-splitter-plugin.cjs.map
