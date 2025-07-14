import { Config } from './config.js';
export declare function multiSortBy<T>(arr: Array<T>, accessors?: Array<(item: T) => any>): Array<T>;
export declare function cleanPath(path: string): string;
export declare function trimPathLeft(path: string): string;
export declare function logging(config: {
    disabled: boolean;
}): {
    log: (...args: Array<any>) => void;
    debug: (...args: Array<any>) => void;
    info: (...args: Array<any>) => void;
    warn: (...args: Array<any>) => void;
    error: (...args: Array<any>) => void;
};
export declare function removeLeadingSlash(path: string): string;
export declare function removeTrailingSlash(s: string): string;
export declare function determineInitialRoutePath(routePath: string): string;
export declare function replaceBackslash(s: string): string;
export declare function routePathToVariable(routePath: string): string;
export declare function removeUnderscores(s?: string): string | undefined;
export declare function capitalize(s: string): string;
export declare function removeExt(d: string, keepExtension?: boolean): string;
/**
 * This function writes to a file if the content is different.
 *
 * @param filepath The path to the file
 * @param content Original content
 * @param incomingContent New content
 * @param callbacks Callbacks to run before and after writing
 * @returns Whether the file was written
 */
export declare function writeIfDifferent(filepath: string, content: string, incomingContent: string, callbacks?: {
    beforeWrite?: () => void;
    afterWrite?: () => void;
}): Promise<boolean>;
/**
 * This function formats the source code using the default formatter (Prettier).
 *
 * @param source The content to format
 * @param config The configuration object
 * @returns The formatted content
 */
export declare function format(source: string, config: Config): Promise<string>;
/**
 * This function resets the regex index to 0 so that it can be reused
 * without having to create a new regex object or worry about the last
 * state when using the global flag.
 *
 * @param regex The regex object to reset
 * @returns
 */
export declare function resetRegex(regex: RegExp): void;
