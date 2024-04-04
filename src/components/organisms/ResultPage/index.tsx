'use client';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

import { SearchResults } from '@/types';

import { Chip, Container, Divider, Tooltip, Typography } from '@mui/material';
import MeaningGroup from './MeaningGroup';
import { createUrl, isFavorite, toggleFavorites } from '@/utils';
import { CheckIcon } from '@/components/atoms/AppIcons';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectSearchResults } from '@/redux/reducers/searchResults';
import { useLexicon } from '@/hooks/use-lexicon';
import { toggleFavoriteLexicon } from '@/redux/reducers/favoriteLexicons';

type ResultPageProps = {
    word: string;
};

const ResultPage = ({ word: rawWord }: ResultPageProps) => {
    const word = decodeURIComponent(rawWord);
    const dispatch = useAppDispatch();
    const [isFavoriteWord, setIsFavoriteWord] = useState(false);

    const resultsFromStore = useAppSelector(selectSearchResults);
    const shouldFetch =
        word && (resultsFromStore.word !== word || (resultsFromStore.word === word && !resultsFromStore.results));
    // if failed to fetch from store, fetch from API
    const { data: resultsFromFetch, isLoading } = useLexicon(shouldFetch ? word : '');

    const results: SearchResults = resultsFromFetch || resultsFromStore.results;

    useEffect(() => {
        setIsFavoriteWord(isFavorite(word));
    }, [word]);

    const handleToggleFavorites = () => {
        const currentState = toggleFavorites(word);
        setIsFavoriteWord(currentState);
        dispatch(toggleFavoriteLexicon(word));
    };

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
