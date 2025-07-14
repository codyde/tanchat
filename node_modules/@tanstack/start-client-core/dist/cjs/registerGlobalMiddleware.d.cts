import { AnyFunctionMiddleware } from './createMiddleware.cjs';
export declare const globalMiddleware: Array<AnyFunctionMiddleware>;
export declare function registerGlobalMiddleware(options: {
    middleware: Array<AnyFunctionMiddleware>;
}): void;
