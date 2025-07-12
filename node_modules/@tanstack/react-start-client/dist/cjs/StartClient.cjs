"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const reactRouter = require("@tanstack/react-router");
const startClientCore = require("@tanstack/start-client-core");
let hydrationPromise;
function StartClient(props) {
  if (!hydrationPromise) {
    if (!props.router.state.matches.length) {
      hydrationPromise = startClientCore.hydrate(props.router);
    } else {
      hydrationPromise = Promise.resolve();
    }
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    reactRouter.Await,
    {
      promise: hydrationPromise,
      children: () => /* @__PURE__ */ jsxRuntime.jsx(reactRouter.RouterProvider, { router: props.router })
    }
  );
}
exports.StartClient = StartClient;
//# sourceMappingURL=StartClient.cjs.map
