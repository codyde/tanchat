import { z } from 'zod';
import { Options as ViteReactOptions } from '@vitejs/plugin-react';
export type WithReactPlugin = {
    react?: ViteReactOptions;
    customViteReactPlugin?: boolean;
};
declare const TanStackStartOptionsSchema: z.ZodDefault<z.ZodOptional<z.ZodObject<{
    tsr: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        target: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<["react", "solid"]>>>>;
        virtualRouteConfig: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodType<import('@tanstack/virtual-file-routes').VirtualRootRoute, z.ZodTypeDef, import('@tanstack/virtual-file-routes').VirtualRootRoute>, z.ZodString]>>>;
        routeFilePrefix: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        routeFileIgnorePrefix: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
        routeFileIgnorePattern: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        routesDirectory: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
        quoteStyle: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<["single", "double"]>>>>;
        semicolons: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
        disableLogging: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
        routeTreeFileHeader: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        indexToken: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
        routeToken: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
        pathParamsAllowedCharacters: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodEnum<[";", ":", "@", "&", "=", "+", "$", ","]>, "many">>>;
        generatedRouteTree: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
        disableTypes: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
        verboseFileRoutes: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        addExtensions: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
        enableRouteTreeFormatting: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
        routeTreeFileFooter: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
        customScaffolding: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            routeTemplate: z.ZodOptional<z.ZodString>;
            lazyRouteTemplate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            routeTemplate?: string | undefined;
            lazyRouteTemplate?: string | undefined;
        }, {
            routeTemplate?: string | undefined;
            lazyRouteTemplate?: string | undefined;
        }>>>;
        experimental: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            enableCodeSplitting: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enableCodeSplitting?: boolean | undefined;
        }, {
            enableCodeSplitting?: boolean | undefined;
        }>>>;
        plugins: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodType<import('@tanstack/router-generator').GeneratorPlugin, z.ZodTypeDef, import('@tanstack/router-generator').GeneratorPlugin>, "many">>>;
        tmpDir: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    } & {
        srcDirectory: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        srcDirectory: string;
        target?: "react" | "solid" | undefined;
        virtualRouteConfig?: string | import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
        routeFilePrefix?: string | undefined;
        routeFileIgnorePrefix?: string | undefined;
        routeFileIgnorePattern?: string | undefined;
        routesDirectory?: string | undefined;
        quoteStyle?: "single" | "double" | undefined;
        semicolons?: boolean | undefined;
        disableLogging?: boolean | undefined;
        routeTreeFileHeader?: string[] | undefined;
        indexToken?: string | undefined;
        routeToken?: string | undefined;
        pathParamsAllowedCharacters?: (";" | ":" | "@" | "&" | "=" | "+" | "$" | ",")[] | undefined;
        generatedRouteTree?: string | undefined;
        disableTypes?: boolean | undefined;
        verboseFileRoutes?: boolean | undefined;
        addExtensions?: boolean | undefined;
        enableRouteTreeFormatting?: boolean | undefined;
        routeTreeFileFooter?: string[] | undefined;
        customScaffolding?: {
            routeTemplate?: string | undefined;
            lazyRouteTemplate?: string | undefined;
        } | undefined;
        experimental?: {
            enableCodeSplitting?: boolean | undefined;
        } | undefined;
        plugins?: import('@tanstack/router-generator').GeneratorPlugin[] | undefined;
        tmpDir?: string | undefined;
    }, {
        target?: "react" | "solid" | undefined;
        virtualRouteConfig?: string | import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
        routeFilePrefix?: string | undefined;
        routeFileIgnorePrefix?: string | undefined;
        routeFileIgnorePattern?: string | undefined;
        routesDirectory?: string | undefined;
        quoteStyle?: "single" | "double" | undefined;
        semicolons?: boolean | undefined;
        disableLogging?: boolean | undefined;
        routeTreeFileHeader?: string[] | undefined;
        indexToken?: string | undefined;
        routeToken?: string | undefined;
        pathParamsAllowedCharacters?: (";" | ":" | "@" | "&" | "=" | "+" | "$" | ",")[] | undefined;
        generatedRouteTree?: string | undefined;
        disableTypes?: boolean | undefined;
        verboseFileRoutes?: boolean | undefined;
        addExtensions?: boolean | undefined;
        enableRouteTreeFormatting?: boolean | undefined;
        routeTreeFileFooter?: string[] | undefined;
        customScaffolding?: {
            routeTemplate?: string | undefined;
            lazyRouteTemplate?: string | undefined;
        } | undefined;
        experimental?: {
            enableCodeSplitting?: boolean | undefined;
        } | undefined;
        plugins?: import('@tanstack/router-generator').GeneratorPlugin[] | undefined;
        tmpDir?: string | undefined;
        srcDirectory?: string | undefined;
    }>>>;
    client: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        entry: z.ZodOptional<z.ZodString>;
        base: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        base: string;
        entry?: string | undefined;
    }, {
        entry?: string | undefined;
        base?: string | undefined;
    }>>>;
    server: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        entry: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        entry?: string | undefined;
    }, {
        entry?: string | undefined;
    }>>>;
    serverFns: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        base: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        base: string;
    }, {
        base?: string | undefined;
    }>>>;
    public: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        dir: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        base: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        base: string;
        dir: string;
    }, {
        base?: string | undefined;
        dir?: string | undefined;
    }>>>;
    pages: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        path: z.ZodString;
        sitemap: z.ZodOptional<z.ZodObject<{
            exclude: z.ZodOptional<z.ZodBoolean>;
            priority: z.ZodOptional<z.ZodNumber>;
            changefreq: z.ZodOptional<z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>>;
            lastmod: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
            alternateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                href: z.ZodString;
                hreflang: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                href: string;
                hreflang: string;
            }, {
                href: string;
                hreflang: string;
            }>, "many">>;
            images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                loc: z.ZodString;
                caption: z.ZodOptional<z.ZodString>;
                title: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                loc: string;
                caption?: string | undefined;
                title?: string | undefined;
            }, {
                loc: string;
                caption?: string | undefined;
                title?: string | undefined;
            }>, "many">>;
            news: z.ZodOptional<z.ZodObject<{
                publication: z.ZodObject<{
                    name: z.ZodString;
                    language: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    language: string;
                }, {
                    name: string;
                    language: string;
                }>;
                publicationDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
                title: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                publication: {
                    name: string;
                    language: string;
                };
                publicationDate: string | Date;
            }, {
                title: string;
                publication: {
                    name: string;
                    language: string;
                };
                publicationDate: string | Date;
            }>>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>>;
        fromCrawl: z.ZodOptional<z.ZodBoolean>;
    } & {
        prerender: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            outputPath: z.ZodOptional<z.ZodString>;
            autoSubfolderIndex: z.ZodOptional<z.ZodBoolean>;
            crawlLinks: z.ZodOptional<z.ZodBoolean>;
            retryCount: z.ZodOptional<z.ZodNumber>;
            retryDelay: z.ZodOptional<z.ZodNumber>;
            onSuccess: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodObject<{
                page: z.ZodObject<{
                    path: z.ZodString;
                    sitemap: z.ZodOptional<z.ZodObject<{
                        exclude: z.ZodOptional<z.ZodBoolean>;
                        priority: z.ZodOptional<z.ZodNumber>;
                        changefreq: z.ZodOptional<z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>>;
                        lastmod: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
                        alternateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            href: z.ZodString;
                            hreflang: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            href: string;
                            hreflang: string;
                        }, {
                            href: string;
                            hreflang: string;
                        }>, "many">>;
                        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            loc: z.ZodString;
                            caption: z.ZodOptional<z.ZodString>;
                            title: z.ZodOptional<z.ZodString>;
                        }, "strip", z.ZodTypeAny, {
                            loc: string;
                            caption?: string | undefined;
                            title?: string | undefined;
                        }, {
                            loc: string;
                            caption?: string | undefined;
                            title?: string | undefined;
                        }>, "many">>;
                        news: z.ZodOptional<z.ZodObject<{
                            publication: z.ZodObject<{
                                name: z.ZodString;
                                language: z.ZodString;
                            }, "strip", z.ZodTypeAny, {
                                name: string;
                                language: string;
                            }, {
                                name: string;
                                language: string;
                            }>;
                            publicationDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
                            title: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            title: string;
                            publication: {
                                name: string;
                                language: string;
                            };
                            publicationDate: string | Date;
                        }, {
                            title: string;
                            publication: {
                                name: string;
                                language: string;
                            };
                            publicationDate: string | Date;
                        }>>;
                    }, "strip", z.ZodTypeAny, {
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
                    }, {
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
                    }>>;
                    fromCrawl: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
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
                }, {
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
                }>;
                html: z.ZodString;
            }, "strip", z.ZodTypeAny, {
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
            }, {
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
            }>], z.ZodUnknown>, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>, "many">>>;
    sitemap: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        host: z.ZodOptional<z.ZodString>;
        outputPath: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        outputPath: string;
        host?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        outputPath?: string | undefined;
        host?: string | undefined;
    }>>;
    prerender: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        concurrency: z.ZodOptional<z.ZodNumber>;
        filter: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodObject<{
            path: z.ZodString;
            sitemap: z.ZodOptional<z.ZodObject<{
                exclude: z.ZodOptional<z.ZodBoolean>;
                priority: z.ZodOptional<z.ZodNumber>;
                changefreq: z.ZodOptional<z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>>;
                lastmod: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
                alternateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    href: z.ZodString;
                    hreflang: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    href: string;
                    hreflang: string;
                }, {
                    href: string;
                    hreflang: string;
                }>, "many">>;
                images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    loc: z.ZodString;
                    caption: z.ZodOptional<z.ZodString>;
                    title: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    loc: string;
                    caption?: string | undefined;
                    title?: string | undefined;
                }, {
                    loc: string;
                    caption?: string | undefined;
                    title?: string | undefined;
                }>, "many">>;
                news: z.ZodOptional<z.ZodObject<{
                    publication: z.ZodObject<{
                        name: z.ZodString;
                        language: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        name: string;
                        language: string;
                    }, {
                        name: string;
                        language: string;
                    }>;
                    publicationDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
                    title: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    title: string;
                    publication: {
                        name: string;
                        language: string;
                    };
                    publicationDate: string | Date;
                }, {
                    title: string;
                    publication: {
                        name: string;
                        language: string;
                    };
                    publicationDate: string | Date;
                }>>;
            }, "strip", z.ZodTypeAny, {
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
            }, {
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
            }>>;
            fromCrawl: z.ZodOptional<z.ZodBoolean>;
        } & {
            prerender: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodOptional<z.ZodBoolean>;
                outputPath: z.ZodOptional<z.ZodString>;
                autoSubfolderIndex: z.ZodOptional<z.ZodBoolean>;
                crawlLinks: z.ZodOptional<z.ZodBoolean>;
                retryCount: z.ZodOptional<z.ZodNumber>;
                retryDelay: z.ZodOptional<z.ZodNumber>;
                onSuccess: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodObject<{
                    page: z.ZodObject<{
                        path: z.ZodString;
                        sitemap: z.ZodOptional<z.ZodObject<{
                            exclude: z.ZodOptional<z.ZodBoolean>;
                            priority: z.ZodOptional<z.ZodNumber>;
                            changefreq: z.ZodOptional<z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>>;
                            lastmod: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
                            alternateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                href: z.ZodString;
                                hreflang: z.ZodString;
                            }, "strip", z.ZodTypeAny, {
                                href: string;
                                hreflang: string;
                            }, {
                                href: string;
                                hreflang: string;
                            }>, "many">>;
                            images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                                loc: z.ZodString;
                                caption: z.ZodOptional<z.ZodString>;
                                title: z.ZodOptional<z.ZodString>;
                            }, "strip", z.ZodTypeAny, {
                                loc: string;
                                caption?: string | undefined;
                                title?: string | undefined;
                            }, {
                                loc: string;
                                caption?: string | undefined;
                                title?: string | undefined;
                            }>, "many">>;
                            news: z.ZodOptional<z.ZodObject<{
                                publication: z.ZodObject<{
                                    name: z.ZodString;
                                    language: z.ZodString;
                                }, "strip", z.ZodTypeAny, {
                                    name: string;
                                    language: string;
                                }, {
                                    name: string;
                                    language: string;
                                }>;
                                publicationDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
                                title: z.ZodString;
                            }, "strip", z.ZodTypeAny, {
                                title: string;
                                publication: {
                                    name: string;
                                    language: string;
                                };
                                publicationDate: string | Date;
                            }, {
                                title: string;
                                publication: {
                                    name: string;
                                    language: string;
                                };
                                publicationDate: string | Date;
                            }>>;
                        }, "strip", z.ZodTypeAny, {
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
                        }, {
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
                        }>>;
                        fromCrawl: z.ZodOptional<z.ZodBoolean>;
                    }, "strip", z.ZodTypeAny, {
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
                    }, {
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
                    }>;
                    html: z.ZodString;
                }, "strip", z.ZodTypeAny, {
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
                }, {
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
                }>], z.ZodUnknown>, z.ZodAny>>;
            }, "strip", z.ZodTypeAny, {
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
            }, {
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
            }>>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>], z.ZodUnknown>, z.ZodAny>>;
        failOnError: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>, z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        outputPath: z.ZodOptional<z.ZodString>;
        autoSubfolderIndex: z.ZodOptional<z.ZodBoolean>;
        crawlLinks: z.ZodOptional<z.ZodBoolean>;
        retryCount: z.ZodOptional<z.ZodNumber>;
        retryDelay: z.ZodOptional<z.ZodNumber>;
        onSuccess: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodObject<{
            page: z.ZodObject<{
                path: z.ZodString;
                sitemap: z.ZodOptional<z.ZodObject<{
                    exclude: z.ZodOptional<z.ZodBoolean>;
                    priority: z.ZodOptional<z.ZodNumber>;
                    changefreq: z.ZodOptional<z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>>;
                    lastmod: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
                    alternateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        href: z.ZodString;
                        hreflang: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        href: string;
                        hreflang: string;
                    }, {
                        href: string;
                        hreflang: string;
                    }>, "many">>;
                    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                        loc: z.ZodString;
                        caption: z.ZodOptional<z.ZodString>;
                        title: z.ZodOptional<z.ZodString>;
                    }, "strip", z.ZodTypeAny, {
                        loc: string;
                        caption?: string | undefined;
                        title?: string | undefined;
                    }, {
                        loc: string;
                        caption?: string | undefined;
                        title?: string | undefined;
                    }>, "many">>;
                    news: z.ZodOptional<z.ZodObject<{
                        publication: z.ZodObject<{
                            name: z.ZodString;
                            language: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            name: string;
                            language: string;
                        }, {
                            name: string;
                            language: string;
                        }>;
                        publicationDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
                        title: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        title: string;
                        publication: {
                            name: string;
                            language: string;
                        };
                        publicationDate: string | Date;
                    }, {
                        title: string;
                        publication: {
                            name: string;
                            language: string;
                        };
                        publicationDate: string | Date;
                    }>>;
                }, "strip", z.ZodTypeAny, {
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
                }, {
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
                }>>;
                fromCrawl: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
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
            }, {
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
            }>;
            html: z.ZodString;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>], z.ZodUnknown>, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>>>>;
    spa: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        maskPath: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        prerender: z.ZodEffects<z.ZodDefault<z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            outputPath: z.ZodOptional<z.ZodString>;
            autoSubfolderIndex: z.ZodOptional<z.ZodBoolean>;
            crawlLinks: z.ZodOptional<z.ZodBoolean>;
            retryCount: z.ZodOptional<z.ZodNumber>;
            retryDelay: z.ZodOptional<z.ZodNumber>;
            onSuccess: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodObject<{
                page: z.ZodObject<{
                    path: z.ZodString;
                    sitemap: z.ZodOptional<z.ZodObject<{
                        exclude: z.ZodOptional<z.ZodBoolean>;
                        priority: z.ZodOptional<z.ZodNumber>;
                        changefreq: z.ZodOptional<z.ZodEnum<["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]>>;
                        lastmod: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
                        alternateRefs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            href: z.ZodString;
                            hreflang: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            href: string;
                            hreflang: string;
                        }, {
                            href: string;
                            hreflang: string;
                        }>, "many">>;
                        images: z.ZodOptional<z.ZodArray<z.ZodObject<{
                            loc: z.ZodString;
                            caption: z.ZodOptional<z.ZodString>;
                            title: z.ZodOptional<z.ZodString>;
                        }, "strip", z.ZodTypeAny, {
                            loc: string;
                            caption?: string | undefined;
                            title?: string | undefined;
                        }, {
                            loc: string;
                            caption?: string | undefined;
                            title?: string | undefined;
                        }>, "many">>;
                        news: z.ZodOptional<z.ZodObject<{
                            publication: z.ZodObject<{
                                name: z.ZodString;
                                language: z.ZodString;
                            }, "strip", z.ZodTypeAny, {
                                name: string;
                                language: string;
                            }, {
                                name: string;
                                language: string;
                            }>;
                            publicationDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
                            title: z.ZodString;
                        }, "strip", z.ZodTypeAny, {
                            title: string;
                            publication: {
                                name: string;
                                language: string;
                            };
                            publicationDate: string | Date;
                        }, {
                            title: string;
                            publication: {
                                name: string;
                                language: string;
                            };
                            publicationDate: string | Date;
                        }>>;
                    }, "strip", z.ZodTypeAny, {
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
                    }, {
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
                    }>>;
                    fromCrawl: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
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
                }, {
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
                }>;
                html: z.ZodString;
            }, "strip", z.ZodTypeAny, {
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
            }, {
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
            }>], z.ZodUnknown>, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
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
        }, {
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
        }>>>, {
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
        }, {
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
        } | undefined>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
        enabled?: boolean | undefined;
        maskPath?: string | undefined;
    }>>;
    root: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    target: z.ZodOptional<z.ZodType<import('nitropack/presets').PresetNameInput | undefined, z.ZodTypeDef, import('nitropack/presets').PresetNameInput | undefined>>;
}, "strip", z.ZodTypeAny, {
    root: string;
    tsr: {
        srcDirectory: string;
        target?: "react" | "solid" | undefined;
        virtualRouteConfig?: string | import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
        routeFilePrefix?: string | undefined;
        routeFileIgnorePrefix?: string | undefined;
        routeFileIgnorePattern?: string | undefined;
        routesDirectory?: string | undefined;
        quoteStyle?: "single" | "double" | undefined;
        semicolons?: boolean | undefined;
        disableLogging?: boolean | undefined;
        routeTreeFileHeader?: string[] | undefined;
        indexToken?: string | undefined;
        routeToken?: string | undefined;
        pathParamsAllowedCharacters?: (";" | ":" | "@" | "&" | "=" | "+" | "$" | ",")[] | undefined;
        generatedRouteTree?: string | undefined;
        disableTypes?: boolean | undefined;
        verboseFileRoutes?: boolean | undefined;
        addExtensions?: boolean | undefined;
        enableRouteTreeFormatting?: boolean | undefined;
        routeTreeFileFooter?: string[] | undefined;
        customScaffolding?: {
            routeTemplate?: string | undefined;
            lazyRouteTemplate?: string | undefined;
        } | undefined;
        experimental?: {
            enableCodeSplitting?: boolean | undefined;
        } | undefined;
        plugins?: import('@tanstack/router-generator').GeneratorPlugin[] | undefined;
        tmpDir?: string | undefined;
    };
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
}, {
    target?: import('nitropack/presets').PresetNameInput | undefined;
    root?: string | undefined;
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
    tsr?: {
        target?: "react" | "solid" | undefined;
        virtualRouteConfig?: string | import('@tanstack/virtual-file-routes').VirtualRootRoute | undefined;
        routeFilePrefix?: string | undefined;
        routeFileIgnorePrefix?: string | undefined;
        routeFileIgnorePattern?: string | undefined;
        routesDirectory?: string | undefined;
        quoteStyle?: "single" | "double" | undefined;
        semicolons?: boolean | undefined;
        disableLogging?: boolean | undefined;
        routeTreeFileHeader?: string[] | undefined;
        indexToken?: string | undefined;
        routeToken?: string | undefined;
        pathParamsAllowedCharacters?: (";" | ":" | "@" | "&" | "=" | "+" | "$" | ",")[] | undefined;
        generatedRouteTree?: string | undefined;
        disableTypes?: boolean | undefined;
        verboseFileRoutes?: boolean | undefined;
        addExtensions?: boolean | undefined;
        enableRouteTreeFormatting?: boolean | undefined;
        routeTreeFileFooter?: string[] | undefined;
        customScaffolding?: {
            routeTemplate?: string | undefined;
            lazyRouteTemplate?: string | undefined;
        } | undefined;
        experimental?: {
            enableCodeSplitting?: boolean | undefined;
        } | undefined;
        plugins?: import('@tanstack/router-generator').GeneratorPlugin[] | undefined;
        tmpDir?: string | undefined;
        srcDirectory?: string | undefined;
    } | undefined;
    client?: {
        entry?: string | undefined;
        base?: string | undefined;
    } | undefined;
    server?: {
        entry?: string | undefined;
    } | undefined;
    serverFns?: {
        base?: string | undefined;
    } | undefined;
    public?: {
        base?: string | undefined;
        dir?: string | undefined;
    } | undefined;
    sitemap?: {
        enabled?: boolean | undefined;
        outputPath?: string | undefined;
        host?: string | undefined;
    } | undefined;
    pages?: {
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
    }[] | undefined;
    spa?: {
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
        enabled?: boolean | undefined;
        maskPath?: string | undefined;
    } | undefined;
}>>>;
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
export type TanStackStartInputConfig = z.input<typeof TanStackStartOptionsSchema>;
export type TanStackStartOutputConfig = ReturnType<typeof getTanStackStartOptions>;
export {};
