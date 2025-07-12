"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_fs = require("node:fs");
const node_url = require("node:url");
const os = require("node:os");
const path = require("node:path");
const rollup = require("nitropack/rollup");
const nitropack = require("nitropack");
const ufo = require("ufo");
const constants = require("../constants.cjs");
const utils = require("../utils.cjs");
const queue = require("./queue.cjs");
async function prerender({
  options,
  nitro,
  builder
}) {
  var _a;
  const logger = utils.createLogger("prerender");
  logger.info("Prerendering pages...");
  if (((_a = options.prerender) == null ? void 0 : _a.enabled) && !options.pages.length) {
    options.pages = [
      {
        path: "/"
      }
    ];
  }
  const serverEnv = builder.environments[constants.VITE_ENVIRONMENT_NAMES.server];
  if (!serverEnv) {
    throw new Error(
      `Vite's "${constants.VITE_ENVIRONMENT_NAMES.server}" environment not found`
    );
  }
  const prerenderOutputDir = path.resolve(
    options.root,
    ".tanstack",
    "start",
    "build",
    "prerenderer"
  );
  const nodeNitro = await nitropack.createNitro({
    ...nitro.options._config,
    preset: "nitro-prerender",
    logLevel: 0,
    output: {
      dir: prerenderOutputDir,
      serverDir: path.resolve(prerenderOutputDir, "server"),
      publicDir: path.resolve(prerenderOutputDir, "public")
    }
  });
  const nodeNitroRollupOptions = rollup.getRollupConfig(nodeNitro);
  const build = serverEnv.config.build;
  build.outDir = prerenderOutputDir;
  build.rollupOptions = {
    ...build.rollupOptions,
    ...nodeNitroRollupOptions,
    output: {
      ...build.rollupOptions.output,
      ...nodeNitroRollupOptions.output,
      sourcemap: void 0
    }
  };
  await nitropack.build(nodeNitro);
  const serverFilename = typeof nodeNitroRollupOptions.output.entryFileNames === "string" ? nodeNitroRollupOptions.output.entryFileNames : "index.mjs";
  const serverEntrypoint = node_url.pathToFileURL(
    path.resolve(path.join(nodeNitro.options.output.serverDir, serverFilename))
  ).toString();
  const { closePrerenderer, localFetch } = await import(serverEntrypoint);
  try {
    const pages = await prerenderPages();
    logger.info(`Prerendered ${pages.length} pages:`);
    pages.forEach((page) => {
      logger.info(`- ${page}`);
    });
  } catch (error) {
    logger.error(error);
  } finally {
    closePrerenderer();
  }
  function extractLinks(html) {
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/g;
    const links = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      if (href && (href.startsWith("/") || href.startsWith("./"))) {
        links.push(href);
      }
    }
    return links;
  }
  async function prerenderPages() {
    var _a2;
    const seen = /* @__PURE__ */ new Set();
    const retriesByPath = /* @__PURE__ */ new Map();
    const concurrency = ((_a2 = options.prerender) == null ? void 0 : _a2.concurrency) ?? os.cpus().length;
    logger.info(`Concurrency: ${concurrency}`);
    const queue$1 = new queue.Queue({ concurrency });
    options.pages.forEach((page) => addCrawlPageTask(page));
    await queue$1.start();
    return Array.from(seen);
    function addCrawlPageTask(page) {
      var _a3, _b;
      if (seen.has(page.path)) return;
      seen.add(page.path);
      if (page.fromCrawl) {
        options.pages.push(page);
      }
      if (!(((_a3 = page.prerender) == null ? void 0 : _a3.enabled) ?? true)) return;
      if (((_b = options.prerender) == null ? void 0 : _b.filter) && !options.prerender.filter(page)) return;
      const prerenderOptions = {
        ...options.prerender,
        ...page.prerender
      };
      queue$1.add(async () => {
        var _a4;
        logger.info(`Crawling: ${page.path}`);
        const retries = retriesByPath.get(page.path) || 0;
        try {
          const encodedRoute = encodeURI(page.path);
          const res = await localFetch(
            ufo.withBase(encodedRoute, nodeNitro.options.baseURL),
            {
              headers: { "x-nitro-prerender": encodedRoute }
            }
          );
          if (!res.ok) {
            throw new Error(`Failed to fetch ${page.path}: ${res.statusText}`, {
              cause: res
            });
          }
          const cleanPagePath = (prerenderOptions.outputPath || page.path).split(/[?#]/)[0];
          const contentType = res.headers.get("content-type") || "";
          const isImplicitHTML = !cleanPagePath.endsWith(".html") && contentType.includes("html");
          const routeWithIndex = cleanPagePath.endsWith("/") ? cleanPagePath + "index" : cleanPagePath;
          const htmlPath = cleanPagePath.endsWith("/") || prerenderOptions.autoSubfolderIndex ? ufo.joinURL(cleanPagePath, "index.html") : cleanPagePath + ".html";
          const filename = ufo.withoutBase(
            isImplicitHTML ? htmlPath : routeWithIndex,
            nitro.options.baseURL
          );
          const html = await res.text();
          const filepath = path.join(nitro.options.output.publicDir, filename);
          await node_fs.promises.mkdir(path.dirname(filepath), {
            recursive: true
          });
          await node_fs.promises.writeFile(filepath, html);
          const newPage = await ((_a4 = prerenderOptions.onSuccess) == null ? void 0 : _a4.call(prerenderOptions, { page, html }));
          if (newPage) {
            Object.assign(page, newPage);
          }
          if (prerenderOptions.crawlLinks ?? true) {
            const links = extractLinks(html);
            for (const link of links) {
              addCrawlPageTask({ path: link, fromCrawl: true });
            }
          }
        } catch (error) {
          if (retries < (prerenderOptions.retryCount ?? 0)) {
            logger.warn(`Encountered error, retrying: ${page.path} in 500ms`);
            await new Promise(
              (resolve) => setTimeout(resolve, prerenderOptions.retryDelay)
            );
            retriesByPath.set(page.path, retries + 1);
            addCrawlPageTask(page);
          } else {
            throw error;
          }
        }
      });
    }
  }
}
exports.prerender = prerender;
//# sourceMappingURL=prerender.cjs.map
