'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { createUrl } from '@/utils';

export const EXAMPLE_QUERIES = ['serendipity', 'affect vs effect', 'break the ice', 'resilience in a sentence'];

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
            const newParams = new URLSearchParams(searchParams.toString());

            if (nextSearch) {
                newParams.set('word', nextSearch);
            } else {
                newParams.delete('word');
            }

            router.push(createUrl('/search', newParams));
        },
        [search, searchParams, router]
    );

    return { search, setSearch, submitSearch };
}
