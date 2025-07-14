"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const reactStartClient = require("@tanstack/react-start-client");
console.warn(
  "[@tanstack/start] Warning: This package has moved to @tanstack/react-start. Please switch to the new package, as this package will be dropped soon."
);
Object.keys(reactStartClient).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: () => reactStartClient[k]
  });
});
//# sourceMappingURL=client.cjs.map
