import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN || 'https://dictionary.thucde.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return staticSitemap;
}

const staticSitemap: MetadataRoute.Sitemap = [
    {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 1
    },
    {
        url: `${BASE_URL}/privacy-policy`,
        changeFrequency: 'daily'
    },
    {
        url: `${BASE_URL}/terms-of-service`,
        changeFrequency: 'daily'
    }
];
