import { VirtualModules } from './virtual-modules.js';
/**
 * we need to explicitly enumerate all imports with string literals,
 * otherwise vite will not pick them up during build
 */
export declare function loadVirtualModule<TId extends keyof VirtualModules>(id: TId): Promise<VirtualModules[TId]>;
