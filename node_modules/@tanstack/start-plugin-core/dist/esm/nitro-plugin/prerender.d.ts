import { ViteBuilder } from 'vite';
import { Nitro } from 'nitropack';
import { TanStackStartOutputConfig } from '../plugin.js';
export declare function prerender({ options, nitro, builder, }: {
    options: TanStackStartOutputConfig;
    nitro: Nitro;
    builder: ViteBuilder;
}): Promise<void>;
