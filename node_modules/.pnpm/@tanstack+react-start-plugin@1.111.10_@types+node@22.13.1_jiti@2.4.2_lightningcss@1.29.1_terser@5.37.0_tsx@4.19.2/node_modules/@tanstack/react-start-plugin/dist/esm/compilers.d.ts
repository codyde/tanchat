import { GeneratorResult, ParseAstOptions } from '@tanstack/router-utils';
type CompileOptions = ParseAstOptions & {
    env: 'server' | 'client' | 'ssr';
    dce?: boolean;
};
export declare function compileStartOutput(opts: CompileOptions): GeneratorResult;
export {};
