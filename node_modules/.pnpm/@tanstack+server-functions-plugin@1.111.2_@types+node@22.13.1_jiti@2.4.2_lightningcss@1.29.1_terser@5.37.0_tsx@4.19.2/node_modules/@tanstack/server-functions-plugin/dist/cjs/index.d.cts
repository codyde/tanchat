import { Plugin } from 'vite';
import { DirectiveFn, ReplacerFn } from '@tanstack/directive-functions-plugin';
export type CreateRpcFn = (functionId: string, serverBase: string, splitImportFn?: string) => any;
declare global {
    var TSR_directiveFnsById: Record<string, DirectiveFn>;
}
export type ServerFnPluginOpts = {
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
