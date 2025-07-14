import invariant from "tiny-invariant";
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createServerRpc = (functionId, serverBase, splitImportFn) => {
  invariant(
    splitImportFn,
    "🚨splitImportFn required for the server functions server runtime, but was not provided."
  );
  const url = `/${sanitizeBase(serverBase)}/${functionId}`;
  return Object.assign(splitImportFn, {
    url,
    functionId
  });
};
export {
  createServerRpc
};
//# sourceMappingURL=index.js.map
