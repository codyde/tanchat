"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const reactStartRouterManifest = require("@tanstack/react-start-router-manifest");
console.warn(
  "[@tanstack/start] Warning: This package has moved to @tanstack/react-start. Please switch to the new package, as this package will be dropped soon."
);
Object.keys(reactStartRouterManifest).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => reactStartRouterManifest[k]
  });
});
//# sourceMappingURL=router-manifest.cjs.map
