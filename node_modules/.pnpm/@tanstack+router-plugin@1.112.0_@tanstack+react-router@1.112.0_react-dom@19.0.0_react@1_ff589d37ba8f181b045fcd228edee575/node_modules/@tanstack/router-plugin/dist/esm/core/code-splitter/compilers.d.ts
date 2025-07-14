import { GeneratorResult, ParseAstOptions } from '@tanstack/router-utils';
import { CodeSplitGroupings, SplitRouteIdentNodes } from '../constants.js';
import { Config } from '../config.js';
export declare function compileCodeSplitReferenceRoute(opts: ParseAstOptions & {
    runtimeEnv: 'dev' | 'prod';
    codeSplitGroupings: CodeSplitGroupings;
    targetFramework: Config['target'];
}): GeneratorResult;
export declare function compileCodeSplitVirtualRoute(opts: ParseAstOptions & {
    splitTargets: Array<SplitRouteIdentNodes>;
}): GeneratorResult;
/**
 * This function should read get the options from by searching for the key `codeSplitGroupings`
 * on createFileRoute and return it's values if it exists, else return undefined
 */
export declare function detectCodeSplitGroupingsFromRoute(opts: ParseAstOptions): {
    groupings: CodeSplitGroupings | undefined;
    routeId: string;
};
