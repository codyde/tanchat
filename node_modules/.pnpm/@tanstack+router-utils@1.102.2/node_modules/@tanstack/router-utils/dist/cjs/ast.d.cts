import { GeneratorOptions, GeneratorResult } from '@babel/generator';
import { ParseResult } from '@babel/parser';
import type * as _babel_types from '@babel/types';
export type ParseAstOptions = {
    code: string;
    filename: string;
    root: string;
    env?: 'server' | 'client' | 'ssr';
};
export declare function parseAst(opts: ParseAstOptions): ParseResult<_babel_types.File>;
type GenerateFromAstOptions = GeneratorOptions & Required<Pick<GeneratorOptions, 'sourceFileName' | 'filename'>>;
export declare function generateFromAst(ast: _babel_types.Node, opts?: GenerateFromAstOptions): GeneratorResult;
export type { GeneratorResult } from '@babel/generator';
