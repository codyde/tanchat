"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const reactRouter = require("@tanstack/react-router");
const Scripts = () => {
  if (process.env.NODE_ENV === "development") {
    console.warn("The Scripts component was moved to `@tanstack/react-router`");
  }
  return /* @__PURE__ */ jsxRuntime.jsx(reactRouter.Scripts, {});
};
exports.Scripts = Scripts;
//# sourceMappingURL=Scripts.cjs.map
