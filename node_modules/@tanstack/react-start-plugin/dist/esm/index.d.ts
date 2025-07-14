import { TanStackStartInputConfig, WithReactPlugin } from './schema.js';
import { PluginOption } from 'vite';
export type { TanStackStartInputConfig, TanStackStartOutputConfig, WithReactPlugin, } from './schema.js';
export declare function TanStackStartVitePlugin(opts?: TanStackStartInputConfig & WithReactPlugin): Array<PluginOption>;
export { TanStackStartVitePlugin as tanstackStart };
