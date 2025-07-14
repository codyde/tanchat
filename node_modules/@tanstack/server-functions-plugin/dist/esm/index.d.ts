import { Plugin } from 'vite';
import { ReplacerFn } from '@tanstack/directive-functions-plugin';
export type CreateRpcFn = (functionId: string, serverBase: string, splitImportFn?: string) => any;
export type ServerFnPluginOpts = {
    /**
     * The virtual import ID that will be used to import the server function manifest.
     * This virtual import ID will be used in the server build to import the manifest
     * and its modules.
     */
    manifestVirtualImportId: string;
    client: ServerFnPluginEnvOpts;
    ssr: ServerFnPluginEnvOpts;
    server: ServerFnPluginEnvOpts;
};
export type ServerFnPluginEnvOpts = {
    getRuntimeCode: () => string;
    replacer: ReplacerFn;
};
export declare function createTanStackServerFnPlugin(opts: ServerFnPluginOpts): {
    client: Array<Plugin>;
    ssr: Array<Plugin>;
    server: Array<Plugin>;
};
export interface TanStackServerFnPluginEnvOpts {
    /**
     * The virtual import ID that will be used to import the server function manifest.
     * This virtual import ID will be used in the server build to import the manifest
     * and its modules.
     */
    manifestVirtualImportId: string;
    client: {
        envName?: string;
        getRuntimeCode: () => string;
        replacer: ReplacerFn;
    };
    server: {
        envName?: string;
        getRuntimeCode: () => string;
        replacer: ReplacerFn;
    };
}
export declare function TanStackServerFnPluginEnv(_opts: TanStackServerFnPluginEnvOpts): Array<Plugin>;
