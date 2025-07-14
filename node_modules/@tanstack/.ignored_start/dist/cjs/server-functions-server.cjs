"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startServerFunctionsServer = require("@tanstack/start-server-functions-server");
console.warn(
  "[@tanstack/start] Warning: This package has moved to @tanstack/react-start. Please switch to the new package, as this package will be dropped soon."
);
Object.keys(startServerFunctionsServer).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startServerFunctionsServer[k]
  });
});
//# sourceMappingURL=server-functions-server.cjs.map
