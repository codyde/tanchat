export declare const VIRTUAL_MODULES: {
    readonly routeTree: "tanstack-start-route-tree:v";
    readonly startManifest: "tanstack-start-manifest:v";
    readonly serverFnManifest: "tanstack-start-server-fn-manifest:v";
};
export type VirtualModules = {
    [VIRTUAL_MODULES.routeTree]: typeof import('tanstack-start-route-tree:v');
    [VIRTUAL_MODULES.startManifest]: typeof import('tanstack-start-manifest:v');
    [VIRTUAL_MODULES.serverFnManifest]: typeof import('tanstack-start-server-fn-manifest:v');
};
