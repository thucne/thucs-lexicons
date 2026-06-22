import { afterEach, describe, expect, it, vi } from 'vitest';

import { FREE_DICTIONARY_API } from '@/constants';
import dictionaryPerfect from '@/__fixtures__/dictionary-perfect.json';
import { dictionaryUrl, extractCoreWord, getFirstDefinition, getFreeDictionaryLexicons } from '@/utils';
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

describe('extractCoreWord', () => {
    it('returns the same word when no patterns are matched', () => {
        expect(extractCoreWord('outbid')).toBe('outbid');
        expect(extractCoreWord('break the ice')).toBe('break the ice');
    });

    it('strips " vs a similar word" or " vs similar word" suffixes', () => {
        expect(extractCoreWord('outbid vs a similar word')).toBe('outbid');
        expect(extractCoreWord('outbid vs similar word')).toBe('outbid');
        expect(extractCoreWord('outbid VS A SIMILAR WORD')).toBe('outbid');
    });

    it('strips " in a sentence" suffix', () => {
        expect(extractCoreWord('outbid in a sentence')).toBe('outbid');
        expect(extractCoreWord('outbid IN A SENTENCE')).toBe('outbid');
    });

    it('strips "common phrases with " prefix', () => {
        expect(extractCoreWord('common phrases with outbid')).toBe('outbid');
        expect(extractCoreWord('COMMON PHRASES WITH outbid')).toBe('outbid');
    });

    it('recursively/repeatedly strips multiple nested patterns', () => {
        expect(extractCoreWord('outbid vs a similar word vs a similar word')).toBe('outbid');
        expect(extractCoreWord('outbid in a sentence vs a similar word')).toBe('outbid');
        expect(extractCoreWord('common phrases with outbid in a sentence')).toBe('outbid');
        expect(extractCoreWord('common phrases with outbid vs a similar word vs a similar word')).toBe('outbid');
    });
});
