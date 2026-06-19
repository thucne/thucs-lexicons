import { describe, expect, it } from 'vitest';

import { getSearchNavigationHref } from './use-search-navigation';

describe('getSearchNavigationHref', () => {
    it('builds the canonical search result path for phrases', () => {
        expect(getSearchNavigationHref('break the ice')).toBe('/search/break%20the%20ice');
    });

    it('trims searches before encoding', () => {
        expect(getSearchNavigationHref('  affect vs effect  ')).toBe('/search/affect%20vs%20effect');
    });

    it('navigates empty searches to the search landing page', () => {
        expect(getSearchNavigationHref('   ')).toBe('/search');
    });
});
