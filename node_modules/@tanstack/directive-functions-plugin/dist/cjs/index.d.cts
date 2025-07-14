import { CompileDirectivesOpts, DirectiveFn } from './compilers.cjs';
import { Plugin } from 'vite';
export type { DirectiveFn, CompileDirectivesOpts, ReplacerFn, } from './compilers.cjs';
export type DirectiveFunctionsViteEnvOptions = Pick<CompileDirectivesOpts, 'getRuntimeCode' | 'replacer'> & {
    envLabel: string;
};
export type DirectiveFunctionsViteOptions = Pick<CompileDirectivesOpts, 'directive' | 'directiveLabel'> & DirectiveFunctionsViteEnvOptions & {
    onDirectiveFnsById?: (directiveFnsById: Record<string, DirectiveFn>) => void;
};
export declare function TanStackDirectiveFunctionsPlugin(opts: DirectiveFunctionsViteOptions): Plugin;
export type DirectiveFunctionsVitePluginEnvOptions = Pick<CompileDirectivesOpts, 'directive' | 'directiveLabel'> & {
    environments: {
        client: DirectiveFunctionsViteEnvOptions & {
            envName?: string;
        };
        server: DirectiveFunctionsViteEnvOptions & {
            envName?: string;
        };
    };
    onDirectiveFnsById?: (directiveFnsById: Record<string, DirectiveFn>) => void;
};
export declare function TanStackDirectiveFunctionsPluginEnv(opts: DirectiveFunctionsVitePluginEnvOptions): Plugin;
