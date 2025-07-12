"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const schema = require("./schema.cjs");
const plugin = require("./plugin.cjs");
const utils = require("./utils.cjs");
exports.createTanStackConfig = schema.createTanStackConfig;
exports.createTanStackStartOptionsSchema = schema.createTanStackStartOptionsSchema;
exports.pageSchema = schema.pageSchema;
exports.TanStackStartVitePluginCore = plugin.TanStackStartVitePluginCore;
exports.resolveViteId = utils.resolveViteId;
//# sourceMappingURL=index.cjs.map
