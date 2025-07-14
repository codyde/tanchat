import { createTanStackStartOptionsSchema } from './schema.cjs';
import { PluginOption } from 'vite';
import { z } from 'zod';
import { CompileStartFrameworkOptions } from './compilers.cjs';
export type TanStackStartInputConfig = z.input<ReturnType<typeof createTanStackStartOptionsSchema>>;
export declare function getTanStackStartOptions(opts?: TanStackStartInputConfig): {
    tsr: {
        target: "react" | "solid";
        routeFileIgnorePrefix: string;
        routesDirectory: string;
        quoteStyle: "single" | "double";
        semicolons: boolean;
        disableLogging: boolean;
        routeTreeFileHeader: string[];
        indexToken: string;
        routeToken: string;
        generatedRouteTree: string;
        disableTypes: boolean;
        addExtensions: boolean;
        enableRouteTreeFormatting: boolean;
        routeTreeFileFooter: string[];
        tmpDir: string;
        virtualRouteConfig?: string | import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
        routeFilePrefix?: string | undefined;
        routeFileIgnorePattern?: string | undefined;
        pathParamsAllowedCharacters?: (";" | ":" | "@" | "&" | "=" | "+" | "$" | ",")[] | undefined;
        verboseFileRoutes?: boolean | undefined;
        autoCodeSplitting?: boolean | undefined;
        customScaffolding?: {
            routeTemplate?: string | undefined;
            lazyRouteTemplate?: string | undefined;
        } | undefined;
        experimental?: {
            enableCodeSplitting?: boolean | undefined;
        } | undefined;
        plugins?: import('@tanstack/router-generator').GeneratorPlugin[] | undefined;
        srcDirectory: string;
    };
    clientEntryPath: string;
    serverEntryPath: string;
    root: string;
    client: {
        base: string;
        entry?: string | undefined;
    };
    server: {
        entry?: string | undefined;
    };
    serverFns: {
        base: string;
    };
    public: {
        base: string;
        dir: string;
    };
    pages: {
        path: string;
        prerender?: {
            enabled?: boolean | undefined;
            outputPath?: string | undefined;
            autoSubfolderIndex?: boolean | undefined;
            crawlLinks?: boolean | undefined;
            retryCount?: number | undefined;
            retryDelay?: number | undefined;
            onSuccess?: ((args_0: {
                page: {
                    path: string;
                    sitemap?: {
                        exclude?: boolean | undefined;
                        priority?: number | undefined;
                        changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
                        lastmod?: string | Date | undefined;
                        alternateRefs?: {
                            href: string;
                            hreflang: string;
                        }[] | undefined;
                        images?: {
                            loc: string;
                            caption?: string | undefined;
                            title?: string | undefined;
                        }[] | undefined;
                        news?: {
                            title: string;
                            publication: {
                                name: string;
                                language: string;
                            };
                            publicationDate: string | Date;
                        } | undefined;
                    } | undefined;
                    fromCrawl?: boolean | undefined;
                };
                html: string;
            }, ...args: unknown[]) => any) | undefined;
        } | undefined;
        sitemap?: {
            exclude?: boolean | undefined;
            priority?: number | undefined;
            changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
            lastmod?: string | Date | undefined;
            alternateRefs?: {
                href: string;
                hreflang: string;
            }[] | undefined;
            images?: {
                loc: string;
                caption?: string | undefined;
                title?: string | undefined;
            }[] | undefined;
            news?: {
                title: string;
                publication: {
                    name: string;
                    language: string;
                };
                publicationDate: string | Date;
            } | undefined;
        } | undefined;
        fromCrawl?: boolean | undefined;
    }[];
    target?: import('nitropack/presets').PresetNameInput | undefined;
    prerender?: ({
        filter?: ((args_0: {
            path: string;
            prerender?: {
                enabled?: boolean | undefined;
                outputPath?: string | undefined;
                autoSubfolderIndex?: boolean | undefined;
                crawlLinks?: boolean | undefined;
                retryCount?: number | undefined;
                retryDelay?: number | undefined;
                onSuccess?: ((args_0: {
                    page: {
                        path: string;
                        sitemap?: {
                            exclude?: boolean | undefined;
                            priority?: number | undefined;
                            changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
                            lastmod?: string | Date | undefined;
                            alternateRefs?: {
                                href: string;
                                hreflang: string;
                            }[] | undefined;
                            images?: {
                                loc: string;
                                caption?: string | undefined;
                                title?: string | undefined;
                            }[] | undefined;
                            news?: {
                                title: string;
                                publication: {
                                    name: string;
                                    language: string;
                                };
                                publicationDate: string | Date;
                            } | undefined;
                        } | undefined;
                        fromCrawl?: boolean | undefined;
                    };
                    html: string;
                }, ...args: unknown[]) => any) | undefined;
            } | undefined;
            sitemap?: {
                exclude?: boolean | undefined;
                priority?: number | undefined;
                changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
                lastmod?: string | Date | undefined;
                alternateRefs?: {
                    href: string;
                    hreflang: string;
                }[] | undefined;
                images?: {
                    loc: string;
                    caption?: string | undefined;
                    title?: string | undefined;
                }[] | undefined;
                news?: {
                    title: string;
                    publication: {
                        name: string;
                        language: string;
                    };
                    publicationDate: string | Date;
                } | undefined;
            } | undefined;
            fromCrawl?: boolean | undefined;
        }, ...args: unknown[]) => any) | undefined;
        enabled?: boolean | undefined;
        concurrency?: number | undefined;
        failOnError?: boolean | undefined;
    } & {
        enabled?: boolean | undefined;
        outputPath?: string | undefined;
        autoSubfolderIndex?: boolean | undefined;
        crawlLinks?: boolean | undefined;
        retryCount?: number | undefined;
        retryDelay?: number | undefined;
        onSuccess?: ((args_0: {
            page: {
                path: string;
                sitemap?: {
                    exclude?: boolean | undefined;
                    priority?: number | undefined;
                    changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
                    lastmod?: string | Date | undefined;
                    alternateRefs?: {
                        href: string;
                        hreflang: string;
                    }[] | undefined;
                    images?: {
                        loc: string;
                        caption?: string | undefined;
                        title?: string | undefined;
                    }[] | undefined;
                    news?: {
                        title: string;
                        publication: {
                            name: string;
                            language: string;
                        };
                        publicationDate: string | Date;
                    } | undefined;
                } | undefined;
                fromCrawl?: boolean | undefined;
            };
            html: string;
        }, ...args: unknown[]) => any) | undefined;
    }) | undefined;
    sitemap?: {
        enabled: boolean;
        outputPath: string;
        host?: string | undefined;
    } | undefined;
    spa?: {
        prerender: {
            enabled: boolean;
            outputPath: string;
            autoSubfolderIndex?: boolean | undefined;
            crawlLinks: boolean;
            retryCount: number;
            retryDelay?: number | undefined;
            onSuccess?: ((args_0: {
                page: {
                    path: string;
                    sitemap?: {
                        exclude?: boolean | undefined;
                        priority?: number | undefined;
                        changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined;
                        lastmod?: string | Date | undefined;
                        alternateRefs?: {
                            href: string;
                            hreflang: string;
                        }[] | undefined;
                        images?: {
                            loc: string;
                            caption?: string | undefined;
                            title?: string | undefined;
                        }[] | undefined;
                        news?: {
                            title: string;
                            publication: {
                                name: string;
                                language: string;
                            };
                            publicationDate: string | Date;
                        } | undefined;
                    } | undefined;
                    fromCrawl?: boolean | undefined;
                };
                html: string;
            }, ...args: unknown[]) => any) | undefined;
        };
        enabled: boolean;
        maskPath: string;
    } | undefined;
};
export type TanStackStartOutputConfig = ReturnType<typeof getTanStackStartOptions>;
export interface TanStackStartVitePluginCoreOptions {
    framework: CompileStartFrameworkOptions;
    getVirtualServerRootHandler: (ctx: {
        routerFilepath: string;
        serverEntryFilepath: string;
    }) => string;
    getVirtualServerEntry: (ctx: {
        routerFilepath: string;
    }) => string;
    getVirtualClientEntry: (ctx: {
        routerFilepath: string;
    }) => string;
}
export declare function TanStackStartVitePluginCore(opts: TanStackStartVitePluginCoreOptions, startConfig: TanStackStartOutputConfig): Array<PluginOption>;
