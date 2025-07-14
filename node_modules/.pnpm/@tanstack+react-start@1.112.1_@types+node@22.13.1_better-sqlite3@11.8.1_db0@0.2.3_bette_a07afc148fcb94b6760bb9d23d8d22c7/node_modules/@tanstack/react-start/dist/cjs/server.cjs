"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const reactStartServer = require("@tanstack/react-start-server");
Object.keys(reactStartServer).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => reactStartServer[k]
  });
});
//# sourceMappingURL=server.cjs.map
