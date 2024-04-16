'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

import { Container, Divider, Typography } from '@mui/material';
import { SearchResults } from '@/types';
import { createUrl } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { SearchResultsState, selectSearchResults } from '@/redux/reducers/searchResults';

import MeaningGroup from './MeaningGroup';
import { useLexicon } from '@/hooks/use-lexicon';
import { persistWordToDatabaseAndStore } from '@/redux/actions/lexicon';
import ToggleFavorite from './ToggleFavorite';

type ResultPageProps = {
    word: string;
    supabaseLexicon: SearchResults;
};

type IsAvailableResponse = [boolean, SearchResults | undefined];

const isAvailableFromSupabase = (word: string, supabaseLexicon: SearchResults): IsAvailableResponse => {
    const isAvailable = word ? word?.length > 0 && supabaseLexicon?.length > 0 : false;
    return [isAvailable, isAvailable ? supabaseLexicon : undefined];
};

const isAvailableFromStore = (word: string, store: SearchResultsState): IsAvailableResponse => {
    const isAvailable = Boolean(store?.word === word && store?.results?.length > 0);

    return [isAvailable, isAvailable ? store.results : undefined];
};

const ResultPage = ({ word: rawWord, supabaseLexicon }: ResultPageProps) => {
    const word = decodeURIComponent(rawWord);

    const dispatch = useAppDispatch();
    const searchResultsFromStore = useAppSelector(selectSearchResults);

    const [inSupabase, resultsFromSupabase] = isAvailableFromSupabase(word, supabaseLexicon);
    const [inStore, resultsFromStore] = isAvailableFromStore(word, searchResultsFromStore);

    // if failed to fetch from store, fetch from API
    const shouldFetch = !inSupabase && !inStore;
    const { data: resultsFromFetch, isLoading } = useLexicon(shouldFetch ? word : '');

    const results = (resultsFromFetch || resultsFromStore || resultsFromSupabase) as SearchResults;

    useEffect(() => {
        if (resultsFromFetch?.length) {
            dispatch(persistWordToDatabaseAndStore(word, resultsFromFetch));
        }
    }, [resultsFromFetch, word, dispatch]);

    if (isLoading) {
        return <div>Fetching data...</div>;
    }

    // if the word is not found in the API, results would be an object
    // {
    //     "title": "No Definitions Found",
    //     "message": "Sorry pal, we couldn't find definitions for the word you were looking for.",
    //     "resolution": "You can try the search again at later time or head to the web instead."
    // }
    if (!Array.isArray(results)) {
        redirect(createUrl('/search', new URLSearchParams({ word })));
    }

    return (
        <Container maxWidth="md">
            <Typography variant="caption" component="h1" gutterBottom className="italic">
                Meaning of <b>{word}</b> in English
            </Typography>
            <ToggleFavorite word={word} />
            {results.map((result, index) => [
                <MeaningGroup
                    key={`${word}-meaning-${index}`}
                    id={`${word}-meaning-group-${index}`}
                    meaning={result}
                />,
                <Divider key={`${word}-divider-${index}`} className="my-4" />
            ])}
        </Container>
    );
};

export default ResultPage;
