import { describe, expect, it } from 'vitest';

import dictionaryPerfect from '@/__fixtures__/dictionary-perfect.json';
import openaiDefinitions from '@/__fixtures__/openai-definitions.json';
import { SearchResults } from '@/types';

import { pickSearchResults } from './result-selection';

const dictionaryResults = dictionaryPerfect as SearchResults;
const aiResults = openaiDefinitions.definitions as SearchResults;

describe('pickSearchResults', () => {
    it('returns same-word store results first', () => {
        expect(
            pickSearchResults({
                store: dictionaryResults,
                storeWord: 'perfect',
                query: 'Perfect',
                fetch: aiResults,
                ai: aiResults
            })
        ).toBe(dictionaryResults);
    });

    it('ignores store results from a different word', () => {
        expect(
            pickSearchResults({
                store: dictionaryResults,
                storeWord: 'perfect',
                query: 'break the ice',
                fetch: aiResults
            })
        ).toBe(aiResults);
    });

    it('returns dictionary fetch results before AI results', () => {
        expect(
            pickSearchResults({
                storeWord: '',
                query: 'perfect',
                fetch: dictionaryResults,
                ai: aiResults
            })
        ).toBe(dictionaryResults);
    });

    it('returns AI results when dictionary results are empty', () => {
        expect(
            pickSearchResults({
                storeWord: '',
                query: 'break the ice',
                fetch: [],
                ai: aiResults
            })
        ).toBe(aiResults);
    });

    it('returns undefined when no source has results', () => {
        expect(
            pickSearchResults({
                store: [],
                storeWord: 'missing',
                query: 'missing',
                fetch: [],
                ai: []
            })
        ).toBeUndefined();
    });

    it('ignores malformed array payloads', () => {
        expect(
            pickSearchResults({
                store: [{ word: 'cached' }],
                storeWord: 'cached',
                query: 'cached',
                fetch: [{ meanings: [] }],
                ai: [{ word: 'ai', meanings: [] }]
            })
        ).toEqual([{ word: 'ai', meanings: [] }]);
    });
});
