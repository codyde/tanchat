"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const cheerio = require("cheerio");
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
const cheerio__namespace = /* @__PURE__ */ _interopNamespaceDefault(cheerio);
function extractHtmlScripts(html) {
  const $ = cheerio__namespace.load(html);
  const scripts = [];
  $("script").each((_, element) => {
    const src = $(element).attr("src");
    const content = $(element).html() ?? void 0;
    scripts.push({
      src,
      content
    });
  });
  return scripts;
}
exports.extractHtmlScripts = extractHtmlScripts;
//# sourceMappingURL=extract-html-scripts.cjs.map
