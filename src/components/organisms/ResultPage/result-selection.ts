import { SearchResult, SearchResults } from '@/types';
import { isPhoneticRegex } from '@/utils/regex';

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

const normalizeLookupText = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();

const isLikelyPhoneticText = (value: string) => {
    const trimmedValue = value.trim();
    const isBracketedPhonetic =
        (trimmedValue.startsWith('/') && trimmedValue.endsWith('/')) ||
        (trimmedValue.startsWith('[') && trimmedValue.endsWith(']'));

    return isBracketedPhonetic && isPhoneticRegex.test(trimmedValue);
};

export function getResultDisplayState(query: string, entry: SearchResult) {
    const searchedWord = query.trim();
    const entryWord = entry.word && entry.word.toLowerCase() !== 'null' ? entry.word.trim() : '';
    const suggestedWord = typeof entry.didYouMean === 'string' && entry.didYouMean.toLowerCase() !== 'null' ? entry.didYouMean.trim() : '';
    const usableSuggestion = suggestedWord && !isLikelyPhoneticText(suggestedWord) ? suggestedWord : '';
    const displayWord = usableSuggestion || entryWord || searchedWord;
    const normalizedQuery = normalizeLookupText(searchedWord);
    const correctionWord =
        usableSuggestion && normalizeLookupText(usableSuggestion) !== normalizedQuery
            ? usableSuggestion
            : entryWord && normalizeLookupText(entryWord) !== normalizedQuery
              ? entryWord
              : undefined;

    return {
        displayWord,
        searchedWord,
        correctionWord,
        isShowingCorrection: Boolean(correctionWord)
    };
}
