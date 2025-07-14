import type { BaseTransportOptions, CheckIn, ClientOptions, DynamicSamplingContext, Event, EventHint, MonitorConfig, ParameterizedString, SeverityLevel, TraceContext } from './types-hoist';
import { Client } from './client';
import type { Scope } from './scope';
export interface ServerRuntimeClientOptions extends ClientOptions<BaseTransportOptions> {
    platform?: string;
    runtime?: {
        name: string;
        version?: string;
    };
    serverName?: string;
}
/**
 * The Sentry Server Runtime Client SDK.
 */
export declare class ServerRuntimeClient<O extends ClientOptions & ServerRuntimeClientOptions = ServerRuntimeClientOptions> extends Client<O> {
    /**
     * Creates a new Edge SDK instance.
     * @param options Configuration options for this SDK.
     */
    constructor(options: O);
    /**
     * @inheritDoc
     */
    eventFromException(exception: unknown, hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    eventFromMessage(message: ParameterizedString, level?: SeverityLevel, hint?: EventHint): PromiseLike<Event>;
    /**
     * @inheritDoc
     */
    captureException(exception: unknown, hint?: EventHint, scope?: Scope): string;
    /**
     * @inheritDoc
     */
    captureEvent(event: Event, hint?: EventHint, scope?: Scope): string;
    /**
     * Create a cron monitor check in and send it to Sentry.
     *
     * @param checkIn An object that describes a check in.
     * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
     * to create a monitor automatically when sending a check in.
     */
    captureCheckIn(checkIn: CheckIn, monitorConfig?: MonitorConfig, scope?: Scope): string;
    /**
     * @inheritDoc
     */
    protected _prepareEvent(event: Event, hint: EventHint, currentScope: Scope, isolationScope: Scope): PromiseLike<Event | null>;
    /** Extract trace information from scope */
    protected _getTraceInfoFromScope(scope: Scope | undefined): [dynamicSamplingContext: Partial<DynamicSamplingContext> | undefined, traceContext: TraceContext | undefined];
}
//# sourceMappingURL=server-runtime-client.d.ts.map