'use client';
import { redirect } from 'next/navigation';

import { useLexicon } from '@/hooks/use-lexicon';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { SearchResultsState, selectSearchResults, setSearchResults } from '@/redux/reducers/searchResults';
import { CircularProgress, Typography } from '@mui/material';

type SearchPageProps = {
    word: string;
};

const SearchPageBody = ({ word }: SearchPageProps) => {
    const resultsFromStore: SearchResultsState = useAppSelector(selectSearchResults);
    const dispatch = useAppDispatch();

    const existed = resultsFromStore.word === word && resultsFromStore.results;

    const { data, error, isLoading } = useLexicon(!existed ? word : undefined, {
        onSuccess: (data) => {
            dispatch(setSearchResults({ word, results: data }));
        }
    });

    if (isLoading) {
        return (
            <Typography className="flex items-center gap-2">
                Fetching data
                <CircularProgress size={16} />
            </Typography>
        );
    }

    if (error) {
        throw new Error('Failed to fetch data');
    }

    if (!word) {
        return <div>Try to search for a word!</div>;
    }

    const results = data || resultsFromStore.results;

    if (!Array.isArray(results)) {
        return (
            <div>
                Lexicon <b>&quot;{word}&quot;</b> not found!
            </div>
        );
    }

    redirect(`/search/${word}`);
};

export default SearchPageBody;
