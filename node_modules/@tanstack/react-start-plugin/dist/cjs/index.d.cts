import { TanStackStartInputConfig, WithReactPlugin } from './schema.cjs';
import { PluginOption } from 'vite';
export type { TanStackStartInputConfig, TanStackStartOutputConfig, WithReactPlugin, } from './schema.cjs';
export declare function TanStackStartVitePlugin(opts?: TanStackStartInputConfig & WithReactPlugin): Array<PluginOption>;
export { TanStackStartVitePlugin as tanstackStart };
