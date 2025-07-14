"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startServerFunctionsClient = require("@tanstack/start-server-functions-client");
console.warn(
  "[@tanstack/start] Warning: This package has moved to @tanstack/react-start. Please switch to the new package, as this package will be dropped soon."
);
Object.keys(startServerFunctionsClient).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startServerFunctionsClient[k]
  });
});
//# sourceMappingURL=server-functions-client.cjs.map
