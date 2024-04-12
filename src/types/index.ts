export type Definition = {
    definition: string;
    synonyms?: Array<string>;
    antonyms?: Array<string>;
    example?: string;
};

export type Meaning = {
    partOfSpeech: string;
    definitions: Array<Definition>;
    synonyms?: Array<string>;
    antonyms?: Array<string>;
};

export type License = {
    name: string;
    url?: string;
};
export type Phonetic = {
    text: string;
    audio?: string;
    sourceUrl?: string;
    license?: License;
};

export type SearchResult = {
    word: string;
    phonetic: string;
    phonetics: Array<Phonetic>;
    meanings: Array<Meaning>;
    origin?: string;
    license?: License;
    sourceUrls?: string[];
};

export type SearchResults = SearchResult[];

export enum ThesaurusType {
    Antonyms = 'antonyms',
    Synonyms = 'synonyms'
}

export enum PromiseStatus {
    Fulfilled = 'fulfilled',
    Rejected = 'rejected'
}

export type SearchResultsSupabase = {
    word: string;
    searchResults: SearchResults;
};
