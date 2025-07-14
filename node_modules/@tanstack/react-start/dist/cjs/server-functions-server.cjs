"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const startServerFunctionsServer = require("@tanstack/start-server-functions-server");
Object.keys(startServerFunctionsServer).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => startServerFunctionsServer[k]
  });
});
//# sourceMappingURL=server-functions-server.cjs.map
