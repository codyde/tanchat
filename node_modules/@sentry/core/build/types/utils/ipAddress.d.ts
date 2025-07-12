import type { Session, SessionAggregates, User } from '../types-hoist';
/**
 * @internal
 */
export declare function addAutoIpAddressToUser(objWithMaybeUser: {
    user?: User | null;
}): void;
/**
 * @internal
 */
export declare function addAutoIpAddressToSession(session: Session | SessionAggregates): void;
//# sourceMappingURL=ipAddress.d.ts.map