import { AnyFunctionMiddleware } from './createMiddleware.js';
export declare const globalMiddleware: Array<AnyFunctionMiddleware>;
export declare function registerGlobalMiddleware(options: {
    middleware: Array<AnyFunctionMiddleware>;
}): void;
