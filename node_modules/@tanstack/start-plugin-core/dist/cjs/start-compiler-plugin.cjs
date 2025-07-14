"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_url = require("node:url");
const routerUtils = require("@tanstack/router-utils");
const startServerCore = require("@tanstack/start-server-core");
const compilers = require("./compilers.cjs");
const debug = process.env.TSR_VITE_DEBUG && ["true", "start-plugin"].includes(process.env.TSR_VITE_DEBUG);
const transformFuncs = [
  "createServerFn",
  "createMiddleware",
  "serverOnly",
  "clientOnly",
  "createIsomorphicFn",
  "createServerFileRoute",
  "createServerRootRoute"
];
const tokenRegex = new RegExp(transformFuncs.join("|"));
function startCompilerPlugin(framework, inputOpts) {
  const opts = {
    client: {
      envName: "client",
      ...inputOpts == null ? void 0 : inputOpts.client
    },
    server: {
      envName: "server",
      ...inputOpts == null ? void 0 : inputOpts.server
    }
  };
  return {
    name: "vite-plugin-tanstack-start-create-server-fn",
    enforce: "pre",
    applyToEnvironment(env) {
      return [opts.client.envName, opts.server.envName].includes(env.name);
    },
    transform: {
      filter: {
        code: tokenRegex,
        id: {
          exclude: startServerCore.VIRTUAL_MODULES.serverFnManifest
        }
      },
      handler(code, id) {
        const env = this.environment.name === opts.client.envName ? "client" : this.environment.name === opts.server.envName ? "server" : (() => {
          throw new Error(
            `Environment ${this.environment.name} not configured`
          );
        })();
        return transformCode({
          code,
          id,
          env,
          framework
        });
      }
    }
  };
}
function transformCode(opts) {
  const { code, env, framework } = opts;
  let { id } = opts;
  const url = node_url.pathToFileURL(id);
  url.searchParams.delete("v");
  id = node_url.fileURLToPath(url).replace(/\\/g, "/");
  if (debug) console.info(`${env} Compiling Start: `, id);
  const compileStartOutput = compilers.compileStartOutputFactory(framework);
  const compiled = compileStartOutput({
    code,
    filename: id,
    env
  });
  if (debug) {
    routerUtils.logDiff(code, compiled.code);
    console.log("Output:\n", compiled.code + "\n\n");
  }
  return compiled;
}
exports.startCompilerPlugin = startCompilerPlugin;
//# sourceMappingURL=start-compiler-plugin.cjs.map
