import { Plugin } from 'vite';
export type TanStackStartViteOptions = {
    globalMiddlewareEntry: string;
};
export declare function createTanStackStartPlugin(opts: TanStackStartViteOptions): {
    client: Array<Plugin>;
    ssr: Array<Plugin>;
    server: Array<Plugin>;
};
export declare function TanStackStartServerFnsAndMiddleware(opts: {
    env: 'server' | 'ssr' | 'client';
}): Plugin;
