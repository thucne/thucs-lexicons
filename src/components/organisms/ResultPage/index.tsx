'use client';
import React from 'react';
import { SearchResults } from '@/types';

import { Container, Divider, Typography } from '@mui/material';
import MeaningGroup from './MeaningGroup';

type ResultPageProps = {
    word: string;
    results: SearchResults;
};

const ResultPage = ({ word, results }: ResultPageProps) => {
    console.log(results);

    return (
        <Container maxWidth="md">
            <Typography variant="caption" component="h1" gutterBottom className="italic">
                Meaning of <b>{word}</b> in English
            </Typography>
            <Divider className="my-4" />
            {results.map((result, index) => [
                <MeaningGroup key={`${word}-meaning-${index}`} meaning={result} />,
                <Divider key={`${word}-divider-${index}`} className="my-4" />
            ])}
        </Container>
    );
};

export default ResultPage;
