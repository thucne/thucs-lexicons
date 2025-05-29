import { FREE_DICTIONARY_API, GET_SUPABASE_WORDS_URL, OPENAI_MEANING_CHECK_API } from '@/constants';
import { License, PromiseStatus, SearchResults, SearchResultsSupabase } from '@/types';

export const createUrl = (url: string, params: URLSearchParams): string => {
    return `${url}?${params.toString()}`;
};

export const getLicenseString = (license?: License): string =>
    license ? `${license.name} | ${license.url || 'No License URL found'}` : 'No License found';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

export const hasDefinition = async (query?: string) => {
    if (!query) {
        return false;
    }

    const res = await fetch(`${FREE_DICTIONARY_API}/${query}`);

    if (!res.ok) {
        const hasMeaning = await fetch(`${DOMAIN}${OPENAI_MEANING_CHECK_API}?input=${encodeURIComponent(query.slice(0, 100))}`).then((res) =>
            res.json()
        ).catch((error) => {
            console.error('Error checking meaning:', error);
            return { value: false };
        });

        if (!hasMeaning?.value) {
            return false;
        }
    }

    return true
};

export const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
};

export const getFirstDefinition = (results: SearchResults) => {
    const firstMeaning = results[0];
    const meaning = firstMeaning.meanings[0];
    const definition = meaning?.definitions?.[0]?.definition || '';
    return definition;
};

export const getSupabaseLexicons = async (words: string[]) => {
    try {
        return await fetch(`${GET_SUPABASE_WORDS_URL}?word=` + words.join(','), { cache: 'force-cache' }).then(
            async (res) => await res.json()
        );
    } catch (error) {
        console.error('Failed to fetch supabase lexicons');
        return [];
    }
};

export const getFreeDictionaryLexicons = async (words: string[]) => {
    const wordsListPromises = words.map(async (word) => {
        const response = await fetch(`${FREE_DICTIONARY_API}/${word}`);
        return await response.json();
    });

    // to speed up the process, we fetch the words in parallel
    const results = await Promise.allSettled(wordsListPromises);

    const fullfilledResults = results
        // filter out the rejected promises
        .filter((result) => result.status === PromiseStatus.Fulfilled)
        // the remaining promises are fulfilled, thus we can safely cast them to PromiseFulfilledResult that contains the value
        .map((result) => (result as PromiseFulfilledResult<any>).value)
        // if the word is not found in the dictionary, the return message would be an object {} instead of an array []
        .filter((result: any) => Array.isArray(result));

    const persistLexicons: SearchResultsSupabase[] = fullfilledResults.map((result: SearchResults) => ({
        word: result[0].word,
        searchResults: result
    }));

    return persistLexicons;
};
