'use client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

import { Chip, Container, Divider, Tooltip, Typography } from '@mui/material';
import { SearchResults } from '@/types';
import { createUrl, isFavorite, toggleFavorites } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { SearchResultsState, selectSearchResults } from '@/redux/reducers/searchResults';
import { toggleFavoriteLexicon } from '@/redux/reducers/favoriteLexicons';

import MeaningGroup from './MeaningGroup';
import { CheckIcon } from '@/components/atoms/AppIcons';
import { useLexicon } from '@/hooks/use-lexicon';
import { persistWordToDatabaseAndStore } from '@/redux/actions/lexicon';
import axios from 'axios';
import { requestLogin } from '@/redux/reducers/auth';

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

    const [isFavoriteWord, setIsFavoriteWord] = useState(false);

    const [inSupabase, resultsFromSupabase] = isAvailableFromSupabase(word, supabaseLexicon);
    const [inStore, resultsFromStore] = isAvailableFromStore(word, searchResultsFromStore);

    // if failed to fetch from store, fetch from API
    const shouldFetch = !inSupabase && !inStore;
    const { data: resultsFromFetch, isLoading } = useLexicon(shouldFetch ? word : '');

    const results = (resultsFromFetch || resultsFromStore || resultsFromSupabase) as SearchResults;

    const handleToggleFavorites = () => {
        const currentState = toggleFavorites(word);
        setIsFavoriteWord(currentState);
        dispatch(toggleFavoriteLexicon(word));
        axios.post('/api/supabase/lexicon/add-to-favorite', { word }, { withCredentials: true }).then((response) => {
            if (response.data?.url) {
                return dispatch(
                    requestLogin({
                        authUrl: response.data.url,
                        callbackUrl: `/search/${word}?favorite=${currentState ? 'remove' : 'add'}`
                    })
                );
            }
            console.log(response);
            console.log('Favorite word added to database!');
        });
    };

    useEffect(() => {
        setIsFavoriteWord(isFavorite(word));
    }, [word]);

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
            <Divider
                className="my-4"
                textAlign="right"
                sx={{
                    '::before, ::after': {
                        borderTopColor: (theme) => theme.palette.warning.main
                    }
                }}
            >
                <Tooltip title={isFavoriteWord ? 'Remove from favorites' : 'Add to favorites'}>
                    <span>
                        <Chip
                            size="small"
                            color="warning"
                            label={isFavoriteWord ? 'Favorite' : 'Add to favorites'}
                            variant={isFavoriteWord ? 'filled' : 'outlined'}
                            clickable
                            onClick={handleToggleFavorites}
                            deleteIcon={isFavoriteWord ? <CheckIcon /> : undefined}
                            onDelete={isFavoriteWord ? handleToggleFavorites : undefined}
                            disabled={word === ''}
                        />
                    </span>
                </Tooltip>
            </Divider>
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
