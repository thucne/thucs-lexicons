import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SearchResults } from '@/types';
import { getFreeDictionaryLexicons } from '@/utils';

const fetchMock = vi.fn();

describe('getFreeDictionaryLexicons for thesaurus data', () => {
    beforeEach(() => {
        fetchMock.mockReset();
        vi.stubGlobal('fetch', fetchMock);
    });

    it('skips empty and non-array dictionary responses', async () => {
        const validResults: SearchResults = [
            {
                word: 'ok',
                phonetic: '',
                phonetics: [],
                meanings: [
                    {
                        partOfSpeech: 'adjective',
                        definitions: [
                            {
                                definition: 'All right.',
                                synonyms: [],
                                antonyms: []
                            }
                        ],
                        synonyms: [],
                        antonyms: []
                    }
                ],
                license: {
                    name: '',
                    url: ''
                },
                sourceUrls: []
            }
        ];
        fetchMock
            .mockResolvedValueOnce({ json: () => Promise.resolve([]) })
            .mockResolvedValueOnce({ json: () => Promise.resolve(validResults) })
            .mockResolvedValueOnce({ json: () => Promise.resolve({ title: 'No Definitions Found' }) });

        await expect(getFreeDictionaryLexicons(['missing', 'ok', 'unknown'])).resolves.toEqual([validResults]);
    });
});
