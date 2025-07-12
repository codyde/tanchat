import { jsx } from "react/jsx-runtime";
import { Await, RouterProvider } from "@tanstack/react-router";
import { hydrate } from "@tanstack/start-client-core";
let hydrationPromise;
function StartClient(props) {
  if (!hydrationPromise) {
    if (!props.router.state.matches.length) {
      hydrationPromise = hydrate(props.router);
    } else {
      hydrationPromise = Promise.resolve();
    }
  }
  return /* @__PURE__ */ jsx(
    Await,
    {
      promise: hydrationPromise,
      children: () => /* @__PURE__ */ jsx(RouterProvider, { router: props.router })
    }
  );
}
export {
  StartClient
};
//# sourceMappingURL=StartClient.js.map
