import type { MetadataRoute } from 'next';

export const revalidate = 5;
const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const allIndexedWords = await fetch(`${BASE_URL}/api/freedictionaryapi/getAll`)
        .then((res) => res.json())
        .catch((err) => {
            console.error('Error fetching indexed words:', err);
            return [];
        });

      console.log('Generating sitemap...', allIndexedWords?.length, 'words found.');

    const dynamicSitemap: MetadataRoute.Sitemap = allIndexedWords.map((word: string) => ({
        url: `${BASE_URL}/search/${word}`,
        changeFrequency: 'weekly',
        priority: 0.5
    }));

    return [
        ...staticSitemap,
        ...dynamicSitemap,
    ];
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
