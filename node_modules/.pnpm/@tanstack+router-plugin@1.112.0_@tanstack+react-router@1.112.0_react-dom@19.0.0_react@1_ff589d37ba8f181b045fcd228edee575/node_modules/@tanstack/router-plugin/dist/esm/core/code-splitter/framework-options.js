function getFrameworkOptions(framework) {
  let frameworkOptions;
  switch (framework) {
    case "react":
      frameworkOptions = {
        package: "@tanstack/react-router",
        idents: {
          createFileRoute: "createFileRoute",
          lazyFn: "lazyFn",
          lazyRouteComponent: "lazyRouteComponent",
          dummyHMRComponent: "TSRDummyComponent"
        },
        dummyHMRComponent: `export function TSRDummyComponent() { return null }`
      };
      break;
    case "solid":
      frameworkOptions = {
        package: "@tanstack/solid-router",
        idents: {
          createFileRoute: "createFileRoute",
          lazyFn: "lazyFn",
          lazyRouteComponent: "lazyRouteComponent",
          dummyHMRComponent: "TSRDummyComponent"
        },
        dummyHMRComponent: `export function TSRDummyComponent() { return null }`
      };
      break;
    default:
      throw new Error(
        `[getFrameworkOptions] - Unsupported framework: ${framework}`
      );
  }
  return frameworkOptions;
}
export {
  getFrameworkOptions
};
//# sourceMappingURL=framework-options.js.map
