'use client';
import { Suspense } from 'react';
import { redirect, useSearchParams } from 'next/navigation';

import { useLexicon } from '@/hooks/use-lexicon';

const Search = () => {
    const searchParams = useSearchParams();
    const word = searchParams.get('word') || '';

    const { data, error, isLoading } = useLexicon(word);

    if (isLoading) {
        return <div>Fetching data...</div>;
    }

    if (error) {
        throw new Error('Failed to fetch data');
    }

    if (!Array.isArray(data)) {
        return <div>Lexicon not found!</div>;
    }
    
    redirect(`/search/${word}`);
};

const SearchPageBody = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Search />
        </Suspense>
    );
};

export default SearchPageBody;
