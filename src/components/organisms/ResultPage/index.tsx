'use client';
import React, { useEffect, useState } from 'react';
import { SearchResults } from '@/types';

import { Chip, Container, Divider, Tooltip, Typography } from '@mui/material';
import MeaningGroup from './MeaningGroup';
import { isFavorite, toggleFavorites } from '@/utils';
import { CheckIcon } from '@/components/atoms/AppIcons';

type ResultPageProps = {
    word: string;
    results: SearchResults;
};

const ResultPage = ({ word, results }: ResultPageProps) => {
    const [isFavoriteWord, setIsFavoriteWord] = useState(false);

    useEffect(() => {
        setIsFavoriteWord(isFavorite(word));
    }, [word]);

    const handleToggleFavorites = () => {
        const currentState = toggleFavorites(word);
        setIsFavoriteWord(currentState);
    };

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
