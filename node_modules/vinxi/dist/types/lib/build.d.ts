/**
 *
 * @param {import('./app.js').App} app
 * @param {BuildConfig} buildConfig
 * @param {string} configFile
 */
export function createBuild(app: import('./app.js').App, buildConfig: BuildConfig, configFile: string): Promise<void>;
/**
 *
 * @param {import("./router-mode.js").Router<{ handler: string }>} router
 * @returns
 */
export function getEntries(router: import("./router-mode.js").Router<{
    handler: string;
}>): Promise<string[]>;
export type BuildConfig = {};
//# sourceMappingURL=build.d.ts.map