import { SerializerParse, SerializerStringify, SerializerStringifyBy } from './serializer.js';
import { AnyValidator, Constrain, Expand, ResolveValidatorInput, Validator } from '@tanstack/router-core';
import { JsonResponse } from '@tanstack/router-core/ssr/client';
import { Readable } from 'node:stream';
import { AnyFunctionMiddleware, AssignAllClientSendContext, AssignAllServerContext, IntersectAllValidatorInputs, IntersectAllValidatorOutputs } from './createMiddleware.js';
export declare function createServerFn<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType = 'data', TResponse = unknown, TMiddlewares = undefined, TValidator = undefined>(options?: {
    method?: TMethod;
    response?: TServerFnResponseType;
    type?: ServerFnType;
}, __opts?: ServerFnBaseOptions<TMethod, TServerFnResponseType, TResponse, TMiddlewares, TValidator>): ServerFnBuilder<TMethod, TServerFnResponseType>;
export declare function executeMiddleware(middlewares: Array<AnyFunctionMiddleware>, env: 'client' | 'server', opts: ServerFnMiddlewareOptions): Promise<ServerFnMiddlewareResult>;
export type CompiledFetcherFnOptions = {
    method: Method;
    data: unknown;
    response?: ServerFnResponseType;
    headers?: HeadersInit;
    signal?: AbortSignal;
    context?: any;
};
export type Fetcher<TMiddlewares, TValidator, TResponse, TServerFnResponseType extends ServerFnResponseType> = undefined extends IntersectAllValidatorInputs<TMiddlewares, TValidator> ? OptionalFetcher<TMiddlewares, TValidator, TResponse, TServerFnResponseType> : RequiredFetcher<TMiddlewares, TValidator, TResponse, TServerFnResponseType>;
export interface FetcherBase {
    url: string;
    __executeServer: (opts: {
        method: Method;
        response?: ServerFnResponseType;
        data: unknown;
        headers?: HeadersInit;
        context?: any;
        signal: AbortSignal;
    }) => Promise<unknown>;
}
export type FetchResult<TMiddlewares, TResponse, TServerFnResponseType extends ServerFnResponseType> = TServerFnResponseType extends 'raw' ? Promise<Response> : TServerFnResponseType extends 'full' ? Promise<FullFetcherData<TMiddlewares, TResponse>> : Promise<FetcherData<TResponse>>;
export interface OptionalFetcher<TMiddlewares, TValidator, TResponse, TServerFnResponseType extends ServerFnResponseType> extends FetcherBase {
    (options?: OptionalFetcherDataOptions<TMiddlewares, TValidator>): FetchResult<TMiddlewares, TResponse, TServerFnResponseType>;
}
export interface RequiredFetcher<TMiddlewares, TValidator, TResponse, TServerFnResponseType extends ServerFnResponseType> extends FetcherBase {
    (opts: RequiredFetcherDataOptions<TMiddlewares, TValidator>): FetchResult<TMiddlewares, TResponse, TServerFnResponseType>;
}
export type FetcherBaseOptions = {
    headers?: HeadersInit;
    type?: ServerFnType;
    signal?: AbortSignal;
};
export type ServerFnType = 'static' | 'dynamic';
export interface OptionalFetcherDataOptions<TMiddlewares, TValidator> extends FetcherBaseOptions {
    data?: Expand<IntersectAllValidatorInputs<TMiddlewares, TValidator>>;
}
export interface RequiredFetcherDataOptions<TMiddlewares, TValidator> extends FetcherBaseOptions {
    data: Expand<IntersectAllValidatorInputs<TMiddlewares, TValidator>>;
}
export interface FullFetcherData<TMiddlewares, TResponse> {
    error: unknown;
    result: FetcherData<TResponse>;
    context: AssignAllClientSendContext<TMiddlewares>;
}
export type FetcherData<TResponse> = TResponse extends JsonResponse<any> ? SerializerParse<ReturnType<TResponse['json']>> : SerializerParse<TResponse>;
export type RscStream<T> = {
    __cacheState: T;
};
export type Method = 'GET' | 'POST';
export type ServerFnResponseType = 'data' | 'full' | 'raw';
export type RawResponse = Response | ReadableStream | Readable | null | string;
export type ServerFnReturnType<TServerFnResponseType extends ServerFnResponseType, TResponse> = TServerFnResponseType extends 'raw' ? RawResponse | Promise<RawResponse> : Promise<SerializerStringify<TResponse>> | SerializerStringify<TResponse>;
export type ServerFn<TMethod, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator, TResponse> = (ctx: ServerFnCtx<TMethod, TServerFnResponseType, TMiddlewares, TValidator>) => ServerFnReturnType<TServerFnResponseType, TResponse>;
export interface ServerFnCtx<TMethod, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator> {
    method: TMethod;
    response: TServerFnResponseType;
    data: Expand<IntersectAllValidatorOutputs<TMiddlewares, TValidator>>;
    context: Expand<AssignAllServerContext<TMiddlewares>>;
    signal: AbortSignal;
}
export type CompiledFetcherFn<TResponse, TServerFnResponseType extends ServerFnResponseType> = {
    (opts: CompiledFetcherFnOptions & ServerFnBaseOptions<Method, TServerFnResponseType>): Promise<TResponse>;
    url: string;
};
export type ServerFnBaseOptions<TMethod extends Method = 'GET', TServerFnResponseType extends ServerFnResponseType = 'data', TResponse = unknown, TMiddlewares = unknown, TInput = unknown> = {
    method: TMethod;
    response?: TServerFnResponseType;
    validateClient?: boolean;
    middleware?: Constrain<TMiddlewares, ReadonlyArray<AnyFunctionMiddleware>>;
    validator?: ConstrainValidator<TInput>;
    extractedFn?: CompiledFetcherFn<TResponse, TServerFnResponseType>;
    serverFn?: ServerFn<TMethod, TServerFnResponseType, TMiddlewares, TInput, TResponse>;
    functionId: string;
    type: ServerFnTypeOrTypeFn<TMethod, TServerFnResponseType, TMiddlewares, AnyValidator>;
};
export type ValidatorInputStringify<TValidator> = SerializerStringifyBy<ResolveValidatorInput<TValidator>, Date | undefined | FormData>;
export type ValidatorSerializerStringify<TValidator> = ValidatorInputStringify<TValidator> extends infer TInput ? Validator<TInput, any> : never;
export type ConstrainValidator<TValidator> = (unknown extends TValidator ? TValidator : ResolveValidatorInput<TValidator> extends ValidatorInputStringify<TValidator> ? TValidator : never) | ValidatorSerializerStringify<TValidator>;
export interface ServerFnMiddleware<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TValidator> {
    middleware: <const TNewMiddlewares = undefined>(middlewares: Constrain<TNewMiddlewares, ReadonlyArray<AnyFunctionMiddleware>>) => ServerFnAfterMiddleware<TMethod, TServerFnResponseType, TNewMiddlewares, TValidator>;
}
export interface ServerFnAfterMiddleware<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator> extends ServerFnValidator<TMethod, TServerFnResponseType, TMiddlewares>, ServerFnTyper<TMethod, TServerFnResponseType, TMiddlewares, TValidator>, ServerFnHandler<TMethod, TServerFnResponseType, TMiddlewares, TValidator> {
}
export type ValidatorFn<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares> = <TValidator>(validator: ConstrainValidator<TValidator>) => ServerFnAfterValidator<TMethod, TServerFnResponseType, TMiddlewares, TValidator>;
export interface ServerFnValidator<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares> {
    validator: ValidatorFn<TMethod, TServerFnResponseType, TMiddlewares>;
}
export interface ServerFnAfterValidator<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator> extends ServerFnMiddleware<TMethod, TServerFnResponseType, TValidator>, ServerFnTyper<TMethod, TServerFnResponseType, TMiddlewares, TValidator>, ServerFnHandler<TMethod, TServerFnResponseType, TMiddlewares, TValidator> {
}
export interface ServerFnTyper<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator> {
    type: (typer: ServerFnTypeOrTypeFn<TMethod, TServerFnResponseType, TMiddlewares, TValidator>) => ServerFnAfterTyper<TMethod, TServerFnResponseType, TMiddlewares, TValidator>;
}
export type ServerFnTypeOrTypeFn<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator> = ServerFnType | ((ctx: ServerFnCtx<TMethod, TServerFnResponseType, TMiddlewares, TValidator>) => ServerFnType);
export interface ServerFnAfterTyper<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator> extends ServerFnHandler<TMethod, TServerFnResponseType, TMiddlewares, TValidator> {
}
export interface ServerFnHandler<TMethod extends Method, TServerFnResponseType extends ServerFnResponseType, TMiddlewares, TValidator> {
    handler: <TNewResponse>(fn?: ServerFn<TMethod, TServerFnResponseType, TMiddlewares, TValidator, TNewResponse>) => Fetcher<TMiddlewares, TValidator, TNewResponse, TServerFnResponseType>;
}
export interface ServerFnBuilder<TMethod extends Method = 'GET', TServerFnResponseType extends ServerFnResponseType = 'data'> extends ServerFnMiddleware<TMethod, TServerFnResponseType, undefined>, ServerFnValidator<TMethod, TServerFnResponseType, undefined>, ServerFnTyper<TMethod, TServerFnResponseType, undefined, undefined>, ServerFnHandler<TMethod, TServerFnResponseType, undefined, undefined> {
    options: ServerFnBaseOptions<TMethod, TServerFnResponseType, unknown, undefined, undefined>;
}
export type StaticCachedResult = {
    ctx?: {
        result: any;
        context: any;
    };
    error?: any;
};
export type ServerFnStaticCache = {
    getItem: (ctx: ServerFnMiddlewareResult) => StaticCachedResult | Promise<StaticCachedResult | undefined>;
    setItem: (ctx: ServerFnMiddlewareResult, response: StaticCachedResult) => Promise<void>;
    fetchItem: (ctx: ServerFnMiddlewareResult) => StaticCachedResult | Promise<StaticCachedResult | undefined>;
};
export declare let serverFnStaticCache: ServerFnStaticCache | undefined;
export declare function setServerFnStaticCache(cache?: ServerFnStaticCache | (() => ServerFnStaticCache | undefined)): () => void;
export declare function createServerFnStaticCache(serverFnStaticCache: ServerFnStaticCache): ServerFnStaticCache;
export declare function extractFormDataContext(formData: FormData): {
    context: unknown;
    data: FormData;
} | {
    data: FormData;
    context?: undefined;
};
export declare function flattenMiddlewares(middlewares: Array<AnyFunctionMiddleware>): Array<AnyFunctionMiddleware>;
export type ServerFnMiddlewareOptions = {
    method: Method;
    response?: ServerFnResponseType;
    data: any;
    headers?: HeadersInit;
    signal?: AbortSignal;
    sendContext?: any;
    context?: any;
    type: ServerFnTypeOrTypeFn<any, any, any, any>;
    functionId: string;
};
export type ServerFnMiddlewareResult = ServerFnMiddlewareOptions & {
    result?: unknown;
    error?: unknown;
    type: ServerFnTypeOrTypeFn<any, any, any, any>;
};
export type NextFn = (ctx: ServerFnMiddlewareResult) => Promise<ServerFnMiddlewareResult>;
export type MiddlewareFn = (ctx: ServerFnMiddlewareOptions & {
    next: NextFn;
}) => Promise<ServerFnMiddlewareResult>;
export declare const applyMiddleware: (middlewareFn: MiddlewareFn, ctx: ServerFnMiddlewareOptions, nextFn: NextFn) => Promise<ServerFnMiddlewareResult>;
export declare function execValidator(validator: AnyValidator, input: unknown): unknown;
export declare function serverFnBaseToMiddleware(options: ServerFnBaseOptions<any, any, any, any, any>): AnyFunctionMiddleware;
