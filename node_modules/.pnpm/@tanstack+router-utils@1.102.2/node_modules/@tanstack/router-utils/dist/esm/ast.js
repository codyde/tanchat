import { parse } from "@babel/parser";
import _generate from "@babel/generator";
function parseAst(opts) {
  return parse(opts.code, {
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
export {
  generateFromAst,
  parseAst
};
//# sourceMappingURL=ast.js.map
