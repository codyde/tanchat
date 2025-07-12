"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const reactStartServer = require("@tanstack/react-start-server");
console.warn(
  "[@tanstack/start] Warning: This package has moved to @tanstack/react-start. Please switch to the new package, as this package will be dropped soon."
);
Object.keys(reactStartServer).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => reactStartServer[k]
  });
});
//# sourceMappingURL=server.cjs.map
