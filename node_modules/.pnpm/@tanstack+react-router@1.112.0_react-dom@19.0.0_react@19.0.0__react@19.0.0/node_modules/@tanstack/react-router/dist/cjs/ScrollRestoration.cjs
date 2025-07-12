"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const useRouter = require("./useRouter.cjs");
const scrollRestoration = require("./scroll-restoration.cjs");
function useScrollRestoration() {
  const router = useRouter.useRouter();
  scrollRestoration.setupScrollRestoration(router, true);
}
function ScrollRestoration(_props) {
  useScrollRestoration();
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "The ScrollRestoration component is deprecated. Use createRouter's `scrollRestoration` option instead."
    );
  }
  return null;
}
function useElementScrollRestoration(options) {
  var _a;
  useScrollRestoration();
  const router = useRouter.useRouter();
  const getKey = options.getKey || scrollRestoration.defaultGetScrollRestorationKey;
  let elementSelector = "";
  if (options.id) {
    elementSelector = `[data-scroll-restoration-id="${options.id}"]`;
  } else {
    const element = (_a = options.getElement) == null ? void 0 : _a.call(options);
    if (!element) {
      return;
    }
    elementSelector = scrollRestoration.getCssSelector(element);
  }
  const restoreKey = getKey(router.latestLocation);
  const byKey = scrollRestoration.scrollRestorationCache.state[restoreKey];
  return byKey == null ? void 0 : byKey[elementSelector];
}
exports.ScrollRestoration = ScrollRestoration;
exports.useElementScrollRestoration = useElementScrollRestoration;
//# sourceMappingURL=ScrollRestoration.cjs.map
