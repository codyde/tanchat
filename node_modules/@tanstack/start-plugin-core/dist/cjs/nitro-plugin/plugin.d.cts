import { PluginOption, Rollup } from 'vite';
import { TanStackStartOutputConfig } from '../plugin.cjs';
export declare function nitroPlugin(options: TanStackStartOutputConfig, getSsrBundle: () => Rollup.OutputBundle): Array<PluginOption>;
