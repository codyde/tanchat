"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function resolveViteId(id) {
  return `\0${id}`;
}
function createLogger(prefix) {
  const label = `[${prefix}]`;
  return {
    log: (...args) => console.log(label, ...args),
    debug: (...args) => console.debug(label, ...args),
    info: (...args) => console.info(label, ...args),
    warn: (...args) => console.warn(label, ...args),
    error: (...args) => console.error(label, ...args)
  };
}
exports.createLogger = createLogger;
exports.resolveViteId = resolveViteId;
//# sourceMappingURL=utils.cjs.map
