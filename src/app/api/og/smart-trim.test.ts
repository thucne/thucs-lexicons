import { describe, expect, it } from 'vitest';

import { smartTrim } from './smart-trim';

describe('smartTrim', () => {
    it('keeps short strings unchanged', () => {
        expect(smartTrim('hello world', 20)).toBe('hello world');
    });

    it('truncates long strings at a word boundary', () => {
        expect(smartTrim('hello world again', 14, ' ', '...')).toBe('hello world...');
    });

    it('falls back to hard trimming when no delimiter exists', () => {
        expect(smartTrim('superlongword', 8, ' ', '...')).toBe('superl...');
    });
});
