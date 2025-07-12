"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const path = require("node:path");
const node_fs = require("node:fs");
const zod = require("zod");
const routerGenerator = require("@tanstack/router-generator");
const tsrConfig = routerGenerator.configSchema.omit({ autoCodeSplitting: true }).partial().extend({
  srcDirectory: zod.z.string().optional().default("src")
});
function createTanStackConfig(frameworkPlugin) {
  const schema = createTanStackStartOptionsSchema(frameworkPlugin);
  return {
    schema,
    parse: (opts) => {
      const options = schema.parse(opts);
      const srcDirectory = options.tsr.srcDirectory;
      const routesDirectory = options.tsr.routesDirectory ?? path.join(srcDirectory, "routes");
      const generatedRouteTree = options.tsr.generatedRouteTree ?? path.join(srcDirectory, "routeTree.gen.ts");
      const clientEntryPath = (() => {
        if (options.client.entry) {
          return path.join(srcDirectory, options.client.entry);
        }
        if (node_fs.existsSync(path.join(srcDirectory, "client.tsx"))) {
          return path.join(srcDirectory, "client.tsx");
        }
        return "/~start/default-client-entry";
      })();
      const serverEntryPath = (() => {
        if (options.server.entry) {
          return path.join(srcDirectory, options.server.entry);
        }
        if (node_fs.existsSync(path.join(srcDirectory, "server.tsx"))) {
          return path.join(srcDirectory, "server.tsx");
        }
        if (node_fs.existsSync(path.join(srcDirectory, "server.ts"))) {
          return path.join(srcDirectory, "server.ts");
        }
        if (node_fs.existsSync(path.join(srcDirectory, "server.js"))) {
          return path.join(srcDirectory, "server.js");
        }
        return "/~start/default-server-entry";
      })();
      return {
        ...options,
        tsr: {
          ...options.tsr,
          ...routerGenerator.getConfig({
            ...options.tsr,
            routesDirectory,
            generatedRouteTree
          })
        },
        clientEntryPath,
        serverEntryPath
      };
    }
  };
}
function createTanStackStartOptionsSchema(frameworkPlugin = {}) {
  return zod.z.object({
    root: zod.z.string().optional().default(process.cwd()),
    target: zod.z.custom().optional(),
    ...frameworkPlugin,
    tsr: tsrConfig.optional().default({}),
    client: zod.z.object({
      entry: zod.z.string().optional(),
      base: zod.z.string().optional().default("/_build")
    }).optional().default({}),
    server: zod.z.object({
      entry: zod.z.string().optional()
    }).optional().default({}),
    serverFns: zod.z.object({
      base: zod.z.string().optional().default("/_serverFn")
    }).optional().default({}),
    public: zod.z.object({
      dir: zod.z.string().optional().default("public"),
      base: zod.z.string().optional().default("/")
    }).optional().default({}),
    pages: zod.z.array(pageSchema).optional().default([]),
    sitemap: zod.z.object({
      enabled: zod.z.boolean().optional().default(true),
      host: zod.z.string().optional(),
      outputPath: zod.z.string().optional().default("sitemap.xml")
    }).optional(),
    prerender: zod.z.object({
      enabled: zod.z.boolean().optional(),
      concurrency: zod.z.number().optional(),
      filter: zod.z.function().args(pageSchema).returns(zod.z.any()).optional(),
      failOnError: zod.z.boolean().optional()
    }).and(pagePrerenderOptionsSchema.optional()).optional(),
    spa: spaSchema.optional()
  }).optional().default({});
}
const pageSitemapOptionsSchema = zod.z.object({
  exclude: zod.z.boolean().optional(),
  priority: zod.z.number().min(0).max(1).optional(),
  changefreq: zod.z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]).optional(),
  lastmod: zod.z.union([zod.z.string(), zod.z.date()]).optional(),
  alternateRefs: zod.z.array(
    zod.z.object({
      href: zod.z.string(),
      hreflang: zod.z.string()
    })
  ).optional(),
  images: zod.z.array(
    zod.z.object({
      loc: zod.z.string(),
      caption: zod.z.string().optional(),
      title: zod.z.string().optional()
    })
  ).optional(),
  news: zod.z.object({
    publication: zod.z.object({
      name: zod.z.string(),
      language: zod.z.string()
    }),
    publicationDate: zod.z.union([zod.z.string(), zod.z.date()]),
    title: zod.z.string()
  }).optional()
});
const pageBaseSchema = zod.z.object({
  path: zod.z.string(),
  sitemap: pageSitemapOptionsSchema.optional(),
  fromCrawl: zod.z.boolean().optional()
});
const pagePrerenderOptionsSchema = zod.z.object({
  enabled: zod.z.boolean().optional(),
  outputPath: zod.z.string().optional(),
  autoSubfolderIndex: zod.z.boolean().optional(),
  crawlLinks: zod.z.boolean().optional(),
  retryCount: zod.z.number().optional(),
  retryDelay: zod.z.number().optional(),
  onSuccess: zod.z.function().args(
    zod.z.object({
      page: pageBaseSchema,
      html: zod.z.string()
    })
  ).returns(zod.z.any()).optional()
});
const spaSchema = zod.z.object({
  enabled: zod.z.boolean().optional().default(true),
  maskPath: zod.z.string().optional().default("/"),
  prerender: pagePrerenderOptionsSchema.optional().default({}).transform((opts) => ({
    outputPath: opts.outputPath ?? "/_shell",
    crawlLinks: false,
    retryCount: 0,
    ...opts,
    enabled: true
  }))
});
const pageSchema = pageBaseSchema.extend({
  prerender: pagePrerenderOptionsSchema.optional()
});
exports.createTanStackConfig = createTanStackConfig;
exports.createTanStackStartOptionsSchema = createTanStackStartOptionsSchema;
exports.pageSchema = pageSchema;
//# sourceMappingURL=schema.cjs.map
