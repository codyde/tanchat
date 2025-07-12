"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startApiRoutes = require("@tanstack/start-api-routes");
console.warn(
  "[@tanstack/start] Warning: This package has moved to @tanstack/react-start. Please switch to the new package, as this package will be dropped soon."
);
Object.keys(startApiRoutes).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startApiRoutes[k]
  });
});
//# sourceMappingURL=api.cjs.map
