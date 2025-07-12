import { Plugin } from 'vite';
declare global {
    var TSS_INJECTED_HEAD_SCRIPTS: string | undefined;
}
export declare function devServerPlugin(): Plugin;
