"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_url = require("node:url");
const routerUtils = require("@tanstack/router-utils");
const compilers = require("./compilers.cjs");
const debug = process.env.TSR_VITE_DEBUG && ["true", "directives-functions-plugin"].includes(process.env.TSR_VITE_DEBUG);
const createDirectiveRx = (directive) => new RegExp(`"${directive}"|'${directive}'`, "gm");
function TanStackDirectiveFunctionsPlugin(opts) {
  let ROOT = process.cwd();
  const directiveRx = createDirectiveRx(opts.directive);
  return {
    name: "tanstack-start-directive-vite-plugin",
    enforce: "pre",
    configResolved: (config) => {
      ROOT = config.root;
    },
    transform(code, id) {
      var _a;
      const url = node_url.pathToFileURL(id);
      url.searchParams.delete("v");
      id = node_url.fileURLToPath(url).replace(/\\/g, "/");
      if (!code.match(directiveRx)) {
        return null;
      }
      if (debug) console.info(`${opts.envLabel}: Compiling Directives: `, id);
      const { compiledResult, directiveFnsById } = compilers.compileDirectives({
        ...opts,
        code,
        root: ROOT,
        filename: id
        // globalThis.app currently refers to Vinxi's app instance. In the future, it can just be the
        // vite dev server instance we get from Nitro.
      });
      (_a = opts.onDirectiveFnsById) == null ? void 0 : _a.call(opts, directiveFnsById);
      if (debug) {
        routerUtils.logDiff(code, compiledResult.code);
        console.log("Output:\n", compiledResult.code + "\n\n");
      }
      return compiledResult;
    }
  };
}
exports.TanStackDirectiveFunctionsPlugin = TanStackDirectiveFunctionsPlugin;
//# sourceMappingURL=index.cjs.map
