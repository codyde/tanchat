import { Plugin } from 'vite';
import { CompileStartFrameworkOptions } from './compilers.js';
export type TanStackStartViteOptions = {
    globalMiddlewareEntry: string;
};
export declare function startCompilerPlugin(framework: CompileStartFrameworkOptions, inputOpts?: {
    client?: {
        envName?: string;
    };
    server?: {
        envName?: string;
    };
}): Plugin;
