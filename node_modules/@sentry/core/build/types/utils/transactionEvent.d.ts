import type { SpanJSON, TransactionEvent } from '../types-hoist';
/**
 * Converts a transaction event to a span JSON object.
 */
export declare function convertTransactionEventToSpanJson(event: TransactionEvent): SpanJSON;
/**
 * Converts a span JSON object to a transaction event.
 */
export declare function convertSpanJsonToTransactionEvent(span: SpanJSON): TransactionEvent;
//# sourceMappingURL=transactionEvent.d.ts.map