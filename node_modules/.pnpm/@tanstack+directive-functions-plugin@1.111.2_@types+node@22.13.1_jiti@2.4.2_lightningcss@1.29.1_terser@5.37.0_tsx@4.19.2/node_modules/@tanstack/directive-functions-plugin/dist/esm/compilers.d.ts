import { GeneratorResult, ParseAstOptions } from '@tanstack/router-utils';
import * as babel from '@babel/core';
export interface DirectiveFn {
    nodePath: SupportedFunctionPath;
    functionName: string;
    functionId: string;
    extractedFilename: string;
    filename: string;
    chunkName: string;
}
export type SupportedFunctionPath = babel.NodePath<babel.types.FunctionDeclaration> | babel.NodePath<babel.types.FunctionExpression> | babel.NodePath<babel.types.ArrowFunctionExpression>;
export type ReplacerFn = (opts: {
    fn: string;
    extractedFilename: string;
    filename: string;
    functionId: string;
    isSourceFn: boolean;
}) => string;
export type CompileDirectivesOpts = ParseAstOptions & {
    directive: string;
    directiveLabel: string;
    getRuntimeCode?: (opts: {
        directiveFnsById: Record<string, DirectiveFn>;
    }) => string;
    replacer: ReplacerFn;
};
export declare function compileDirectives(opts: CompileDirectivesOpts): {
    compiledResult: GeneratorResult;
    directiveFnsById: Record<string, DirectiveFn>;
};
export declare function findDirectives(ast: babel.types.File, opts: ParseAstOptions & {
    directive: string;
    directiveLabel: string;
    replacer?: ReplacerFn;
    directiveSplitParam: string;
}): Record<string, DirectiveFn>;
