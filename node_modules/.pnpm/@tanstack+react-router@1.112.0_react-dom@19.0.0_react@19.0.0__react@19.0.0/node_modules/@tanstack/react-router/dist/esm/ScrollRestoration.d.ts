import { ScrollRestorationOptions } from './scroll-restoration.js';
import { ParsedLocation } from '@tanstack/router-core';
/**
 * @deprecated use createRouter's `scrollRestoration` option instead
 */
export declare function ScrollRestoration(_props: ScrollRestorationOptions): null;
export declare function useElementScrollRestoration(options: ({
    id: string;
    getElement?: () => Element | undefined | null;
} | {
    id?: string;
    getElement: () => Element | undefined | null;
}) & {
    getKey?: (location: ParsedLocation) => string;
}): import('./scroll-restoration.js').ScrollRestorationEntry | undefined;
