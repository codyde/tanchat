import type { HandlerDataFetch, Span, SpanOrigin } from './types-hoist';
/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */
export declare function instrumentFetchRequest(handlerData: HandlerDataFetch, shouldCreateSpan: (url: string) => boolean, shouldAttachHeaders: (url: string) => boolean, spans: Record<string, Span>, spanOrigin?: SpanOrigin): Span | undefined;
//# sourceMappingURL=fetch.d.ts.map