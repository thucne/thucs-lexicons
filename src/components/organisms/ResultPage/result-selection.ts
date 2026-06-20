import { SearchResults } from '@/types';

type PickSearchResultsArgs = {
    store?: unknown;
    storeWord: string;
    query: string;
    fetch?: unknown;
    ai?: unknown;
};

export function isSearchResults(value: unknown): value is SearchResults {
    return (
        Array.isArray(value) &&
        value.every(
            (result) =>
                typeof result === 'object' &&
                result !== null &&
                'word' in result &&
                typeof result.word === 'string' &&
                'meanings' in result &&
                Array.isArray(result.meanings)
        )
    );
}

const hasResults = (results?: unknown): results is SearchResults => isSearchResults(results) && results.length > 0;

export function pickSearchResults({ store, storeWord, query, fetch, ai }: PickSearchResultsArgs) {
    if (storeWord.toLowerCase() === query.toLowerCase() && hasResults(store)) {
        return store;
    }

    if (hasResults(fetch)) {
        return fetch;
    }

    if (hasResults(ai)) {
        return ai;
    }

    return undefined;
}
