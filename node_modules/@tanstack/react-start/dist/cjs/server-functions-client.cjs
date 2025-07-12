"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startServerFunctionsClient = require("@tanstack/start-server-functions-client");
Object.keys(startServerFunctionsClient).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startServerFunctionsClient[k]
  });
});
//# sourceMappingURL=server-functions-client.cjs.map
