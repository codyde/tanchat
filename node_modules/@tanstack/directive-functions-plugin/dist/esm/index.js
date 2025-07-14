import { pathToFileURL, fileURLToPath } from "node:url";
import { logDiff } from "@tanstack/router-utils";
import { compileDirectives } from "./compilers.js";
const debug = process.env.TSR_VITE_DEBUG && ["true", "directives-functions-plugin"].includes(process.env.TSR_VITE_DEBUG);
const createDirectiveRx = (directive) => new RegExp(`"${directive}"|'${directive}'`, "gm");
function TanStackDirectiveFunctionsPlugin(opts) {
  let root = process.cwd();
  const directiveRx = createDirectiveRx(opts.directive);
  return {
    name: "tanstack-start-directive-vite-plugin",
    enforce: "pre",
    configResolved: (config) => {
      root = config.root;
    },
    transform(code, id) {
      return transformCode({ ...opts, code, id, directiveRx, root });
    }
  };
}
function TanStackDirectiveFunctionsPluginEnv(opts) {
  opts = {
    ...opts,
    environments: {
      client: {
        envName: "client",
        ...opts.environments.client
      },
      server: {
        envName: "server",
        ...opts.environments.server
      }
    }
  };
  let root = process.cwd();
  const directiveRx = createDirectiveRx(opts.directive);
  return {
    name: "tanstack-start-directive-vite-plugin",
    enforce: "pre",
    buildStart() {
      root = this.environment.config.root;
    },
    applyToEnvironment(env) {
      return [
        opts.environments.client.envName,
        opts.environments.server.envName
      ].includes(env.name);
    },
    transform: {
      filter: {
        code: directiveRx
      },
      handler(code, id) {
        const envOptions = [
          opts.environments.client,
          opts.environments.server
        ].find((e) => e.envName === this.environment.name);
        if (!envOptions) {
          throw new Error(`Environment ${this.environment.name} not found`);
        }
        return transformCode({
          ...opts,
          ...envOptions,
          code,
          id,
          directiveRx,
          root
        });
      }
    }
  };
}
function transformCode({
  code,
  id,
  directiveRx,
  envLabel,
  directive,
  directiveLabel,
  getRuntimeCode,
  replacer,
  onDirectiveFnsById,
  root
}) {
  const url = pathToFileURL(id);
  url.searchParams.delete("v");
  id = fileURLToPath(url).replace(/\\/g, "/");
  if (!code.match(directiveRx)) {
    return null;
  }
  if (debug) console.info(`${envLabel}: Compiling Directives: `, id);
  const { compiledResult, directiveFnsById, isDirectiveSplitParam } = compileDirectives({
    directive,
    directiveLabel,
    getRuntimeCode,
    replacer,
    code,
    root,
    filename: id
  });
  if (!isDirectiveSplitParam) {
    onDirectiveFnsById == null ? void 0 : onDirectiveFnsById(directiveFnsById);
  }
  if (debug) {
    logDiff(code, compiledResult.code);
    console.log("Output:\n", compiledResult.code + "\n\n");
  }
  return compiledResult;
}
export {
  TanStackDirectiveFunctionsPlugin,
  TanStackDirectiveFunctionsPluginEnv
};
//# sourceMappingURL=index.js.map
