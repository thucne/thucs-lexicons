'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';

import { useLexicon } from '@/hooks/use-lexicon';

const SearchPageBody = () => {
    const searchParams = useSearchParams();

    const word = searchParams.get('word') || '';

    const { data, error, isLoading } = useLexicon(word);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        throw new Error('Failed to fetch data');
    }

    console.log(data);

    return <div>
        OK
    </div>;
};

export default SearchPageBody;
