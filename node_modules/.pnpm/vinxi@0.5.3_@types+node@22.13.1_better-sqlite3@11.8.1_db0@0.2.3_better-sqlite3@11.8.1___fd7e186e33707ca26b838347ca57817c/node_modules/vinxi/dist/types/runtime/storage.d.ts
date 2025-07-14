/**
 *
 * @param {import('unstorage/drivers/fs').FSStorageOptions} options
 */
export function fsDriver(options: import('unstorage/drivers/fs').FSStorageOptions): Promise<import("../node_modules/unstorage/dist/shared/unstorage.28bc67f1").D<import("unstorage/drivers/fs").FSStorageOptions | undefined, never>>;
/**
 *
 * @param {import('unstorage/drivers/http').HTTPOptions} options
 */
export function httpDriver(options: import('unstorage/drivers/http').HTTPOptions): Promise<any>;
/**
 *
 */
export function memoryDriver(): Promise<import("../node_modules/unstorage/dist/shared/unstorage.28bc67f1").D<void, Map<string, any>>>;
/**
 *
 * @param {import('unstorage/drivers/overlay').OverlayStorageOptions} options
 */
export function overlayDriver(options: import('unstorage/drivers/overlay').OverlayStorageOptions): Promise<import("../node_modules/unstorage/dist/shared/unstorage.28bc67f1").D<import("unstorage/drivers/overlay").OverlayStorageOptions, never>>;
export * from "unstorage";
//# sourceMappingURL=storage.d.ts.map