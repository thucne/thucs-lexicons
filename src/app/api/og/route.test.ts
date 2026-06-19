import { describe, expect, it } from 'vitest';

import { buildOgImageUrl, getSafeOgParams, MAX_OG_DEFINITION, MAX_OG_WORD } from './og-utils';

describe('OG image parameters', () => {
    it('rejects an over-limit word before image generation', () => {
        const params = new URLSearchParams({
            word: 'a'.repeat(MAX_OG_WORD + 1)
        });

        expect(getSafeOgParams(params)).toEqual({ ok: false, error: 'word too long' });
    });

    it('bounds definition length before trimming and image generation', () => {
        const params = new URLSearchParams({
            word: 'lexicon',
            definition: 'd'.repeat(10_000)
        });

        expect(getSafeOgParams(params)).toEqual({
            ok: true,
            word: 'lexicon',
            definition: 'd'.repeat(MAX_OG_DEFINITION)
        });
    });

    it('encodes spaces in metadata OG image URLs', () => {
        expect(buildOgImageUrl('break the ice', 'Open Lexicons')).toContain('word=break+the+ice');
    });

    it('encodes ampersands inside metadata OG image URL values', () => {
        const url = buildOgImageUrl('a&b', 'definition');

        expect(url).toContain('word=a%26b');
        expect(new URL(`http://localhost${url}`).searchParams.get('word')).toBe('a&b');
    });
});
