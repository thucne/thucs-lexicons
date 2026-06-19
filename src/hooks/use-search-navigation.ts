'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const EXAMPLE_QUERIES = ['serendipity', 'affect vs effect', 'break the ice', 'resilience in a sentence'];

export function getSearchNavigationHref(word: string) {
    const nextSearch = word.trim();
    return nextSearch ? `/search/${encodeURIComponent(nextSearch)}` : '/search';
}

export function useSearchNavigation(defaultValue = '') {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [search, setSearch] = useState(defaultValue);

    const searchFromParams = searchParams.get('word');
    const searchFromPath = /^\/search\/([^/]+)$/.exec(pathname)?.[1];

    useEffect(() => {
        setSearch(decodeURIComponent(searchFromParams || searchFromPath || defaultValue || ''));
    }, [searchFromParams, searchFromPath, defaultValue]);

    const submitSearch = useCallback(
        (word?: string) => {
            const nextSearch = (word ?? search).trim();
            router.push(getSearchNavigationHref(nextSearch));
        },
        [search, router]
    );

    return { search, setSearch, submitSearch };
}
