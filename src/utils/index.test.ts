import { afterEach, describe, expect, it, vi } from 'vitest';

import { FREE_DICTIONARY_API } from '@/constants';
import dictionaryPerfect from '@/__fixtures__/dictionary-perfect.json';
import { dictionaryUrl, getFirstDefinition, getFreeDictionaryLexicons } from '@/utils';
import { SearchResults } from '@/types';

const perfectResults = dictionaryPerfect as SearchResults;

describe('dictionaryUrl', () => {
    it('encodes spaces in dictionary path segments', () => {
        expect(dictionaryUrl('break the ice')).toBe(`${FREE_DICTIONARY_API}/break%20the%20ice`);
    });

    it('encodes unicode characters in dictionary path segments', () => {
        expect(dictionaryUrl('café')).toBe(`${FREE_DICTIONARY_API}/caf%C3%A9`);
    });

    it('encodes slashes in dictionary path segments', () => {
        expect(dictionaryUrl('a/b')).toBe(`${FREE_DICTIONARY_API}/a%2Fb`);
    });
});

describe('getFirstDefinition', () => {
    it('returns the first definition string from dictionary results', () => {
        expect(getFirstDefinition(perfectResults)).toBe(
            'Having all the required or desirable elements, qualities, or characteristics.'
        );
    });
});

describe('getFreeDictionaryLexicons', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns only non-empty array responses', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ json: async () => perfectResults })
            .mockResolvedValueOnce({ json: async () => ({ title: 'No Definitions Found' }) })
            .mockResolvedValueOnce({ json: async () => [] });
        vi.stubGlobal('fetch', fetchMock);

        await expect(getFreeDictionaryLexicons(['perfect', 'missing', 'empty'])).resolves.toEqual([perfectResults]);
    });

    it('deduplicates words before fetching', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ json: async () => perfectResults });
        vi.stubGlobal('fetch', fetchMock);

        await getFreeDictionaryLexicons(['perfect', 'perfect']);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(`${FREE_DICTIONARY_API}/perfect`);
    });
});
