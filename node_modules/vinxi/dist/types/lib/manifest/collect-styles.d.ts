export function isCssModulesFile(file: string): boolean;
export function isCssUrlWithoutSideEffects(url: string): boolean;
export default findStylesInModuleGraph;
/**
 *
 * @param {import('vite').ViteDevServer} vite
 * @param {*} match
 * @returns
 */
declare function findStylesInModuleGraph(vite: import('vite').ViteDevServer, match: any, ssr: any): Promise<{}>;
//# sourceMappingURL=collect-styles.d.ts.map