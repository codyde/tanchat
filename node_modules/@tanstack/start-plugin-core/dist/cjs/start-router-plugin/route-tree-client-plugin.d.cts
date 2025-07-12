import { Plugin } from 'vite';
import { Config } from '@tanstack/router-generator';
/**
 * This removes the server part from the generated route tree so that it can be used on the client.
 */
export declare function routeTreeClientPlugin(config: Config): Plugin;
