import { TanStackStartOutputConfig } from '../plugin.cjs';
export type SitemapUrl = {
    loc: string;
    lastmod: string;
    priority?: number;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    alternateRefs?: Array<{
        href: string;
        hreflang?: string;
    }>;
    images?: Array<{
        loc: string;
        title?: string;
        caption?: string;
    }>;
    news?: {
        publication: {
            name: string;
            language: string;
        };
        publicationDate: string | Date;
        title: string;
    };
};
export type SitemapData = {
    urls: Array<SitemapUrl>;
};
export declare function buildSitemap({ options, publicDir, }: {
    options: TanStackStartOutputConfig;
    publicDir: string;
}): void;
