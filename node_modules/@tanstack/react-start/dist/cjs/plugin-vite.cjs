"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const reactStartPlugin = require("@tanstack/react-start-plugin");
Object.keys(reactStartPlugin).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => reactStartPlugin[k]
  });
});
//# sourceMappingURL=plugin-vite.cjs.map
