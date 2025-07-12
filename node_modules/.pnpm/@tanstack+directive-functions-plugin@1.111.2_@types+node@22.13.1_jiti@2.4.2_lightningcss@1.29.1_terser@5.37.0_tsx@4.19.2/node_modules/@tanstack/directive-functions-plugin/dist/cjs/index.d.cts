import { CompileDirectivesOpts, DirectiveFn } from './compilers.cjs';
import { Plugin } from 'vite';
export type { DirectiveFn, CompileDirectivesOpts, ReplacerFn, } from './compilers.cjs';
export type DirectiveFunctionsViteOptions = Pick<CompileDirectivesOpts, 'directive' | 'directiveLabel' | 'getRuntimeCode' | 'replacer'> & {
    envLabel: string;
};
export declare function TanStackDirectiveFunctionsPlugin(opts: DirectiveFunctionsViteOptions & {
    onDirectiveFnsById?: (directiveFnsById: Record<string, DirectiveFn>) => void;
}): Plugin;
