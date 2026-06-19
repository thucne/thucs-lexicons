import { FREE_DICTIONARY_API, OPENAI_MEANING_CHECK_API } from '@/constants';
import { License, SearchResults } from '@/types';

export const createUrl = (url: string, params: URLSearchParams): string => {
    return `${url}?${params.toString()}`;
};

export const getLicenseString = (license?: License): string =>
    license ? `${license.name} | ${license.url || 'No License URL found'}` : 'No License found';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || '';

export const dictionaryUrl = (word: string) => [FREE_DICTIONARY_API, encodeURIComponent(word)].join('/');

export const hasDefinition = async (query?: string) => {
    if (!query) {
        return false;
    }

    const res = await fetch(dictionaryUrl(query));

    if (!res.ok) {
        const hasMeaning = await fetch(
            `${DOMAIN}${OPENAI_MEANING_CHECK_API}?input=${encodeURIComponent(query.slice(0, 100))}`
        )
            .then((res) => res.json())
            .catch((error) => {
                console.error('Error checking meaning:', error);
                return { value: false };
            });

        if (!hasMeaning?.value) {
            return false;
        }
    }

    return true;
};

export const getFirstDefinition = (results: SearchResults) => {
    const firstMeaning = results[0];
    const meaning = firstMeaning.meanings[0];
    const definition = meaning?.definitions?.[0]?.definition || '';
    return definition;
};

export const getFreeDictionaryLexicons = async (words: string[]) => {
    const wordsListPromises = words.map(async (word) => {
        const response = await fetch(dictionaryUrl(word));
        return await response.json();
    });

    // to speed up the process, we fetch the words in parallel
    const results = await Promise.allSettled(wordsListPromises);

    return results
        .filter((result): result is PromiseFulfilledResult<SearchResults> => result.status === 'fulfilled')
        .map((result) => result.value)
        .filter((result): result is SearchResults => Array.isArray(result));
};
