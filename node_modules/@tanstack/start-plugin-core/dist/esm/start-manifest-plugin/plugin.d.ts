import { PluginOption, Rollup } from 'vite';
import { RouterManagedTag } from '@tanstack/router-core';
export declare const getCSSRecursively: (chunk: Rollup.OutputChunk, chunksByFileName: Map<string, Rollup.OutputChunk>, basePath: string) => RouterManagedTag[];
export declare function startManifestPlugin(opts: {
    clientEntry: string;
}): PluginOption;
