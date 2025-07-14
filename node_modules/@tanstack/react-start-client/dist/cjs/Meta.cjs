"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const reactRouter = require("@tanstack/react-router");
const Meta = () => {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "The Meta component is deprecated. Use `HeadContent` from `@tanstack/react-router` instead."
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(reactRouter.HeadContent, {});
};
exports.Meta = Meta;
//# sourceMappingURL=Meta.cjs.map
