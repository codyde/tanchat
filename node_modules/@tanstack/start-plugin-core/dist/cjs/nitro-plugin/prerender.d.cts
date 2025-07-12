import { ViteBuilder } from 'vite';
import { Nitro } from 'nitropack';
import { TanStackStartOutputConfig } from '../plugin.cjs';
export declare function prerender({ options, nitro, builder, }: {
    options: TanStackStartOutputConfig;
    nitro: Nitro;
    builder: ViteBuilder;
}): Promise<void>;
