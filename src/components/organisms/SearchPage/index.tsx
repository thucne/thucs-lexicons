'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

import { useLexicon } from '@/hooks/use-lexicon';
import { useAppDispatch } from '@/redux/store';
import { setSearchResults } from '@/redux/reducers/searchResults';

type SearchPageProps = {
    word: string;
};

const SearchPageBody = ({ word }: SearchPageProps) => {
    const dispatch = useAppDispatch();

    const { data, error, isLoading } = useLexicon(word, {
        onSuccess: (data) => {
            console.log('data', data);
            dispatch(setSearchResults({ word, results: data }));
        }
    });

    if (isLoading) {
        return <div>Fetching data...</div>;
    }

    if (error) {
        throw new Error('Failed to fetch data');
    }

    if (!word) {
        return <div>Try to search for a word!</div>;
    }

    if (!Array.isArray(data)) {
        return (
            <div>
                Lexicon <b>&quot;{word}&quot;</b> not found!
            </div>
        );
    }

    redirect(`/search/${word}`);
};

export default SearchPageBody;
