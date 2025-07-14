"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const reactStartConfig = require("@tanstack/react-start-config");
Object.keys(reactStartConfig).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => reactStartConfig[k]
  });
});
//# sourceMappingURL=config.cjs.map
