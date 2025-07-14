import { jsx } from "react/jsx-runtime";
import { HeadContent } from "@tanstack/react-router";
const Meta = () => {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "The Meta component is deprecated. Use `HeadContent` from `@tanstack/react-router` instead."
    );
  }
  return /* @__PURE__ */ jsx(HeadContent, {});
};
export {
  Meta
};
//# sourceMappingURL=Meta.js.map
