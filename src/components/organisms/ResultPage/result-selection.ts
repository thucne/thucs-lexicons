import { SearchResults } from '@/types';

type PickSearchResultsArgs = {
    store?: SearchResults;
    storeWord: string;
    query: string;
    fetch?: SearchResults;
    ai?: SearchResults;
};

const hasResults = (results?: SearchResults): results is SearchResults => Boolean(results?.length);

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
