"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const parser = require("@babel/parser");
const _generate = require("@babel/generator");
function parseAst(opts) {
  return parser.parse(opts.code, {
    plugins: ["jsx", "typescript"],
    sourceType: "module",
    ...{
      root: opts.root,
      filename: opts.filename,
      env: opts.env
    }
  });
}
let generate = _generate;
if ("default" in generate) {
  generate = generate.default;
}
function generateFromAst(ast, opts) {
  return generate(
    ast,
    opts ? { importAttributesKeyword: "with", sourceMaps: true, ...opts } : void 0
  );
}
exports.generateFromAst = generateFromAst;
exports.parseAst = parseAst;
//# sourceMappingURL=ast.cjs.map
