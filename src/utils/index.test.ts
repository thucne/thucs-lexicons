import { describe, expect, it } from 'vitest';

import { FREE_DICTIONARY_API } from '@/constants';
import { dictionaryUrl } from '@/utils';

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
