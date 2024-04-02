'use client';
import React from 'react';
import { SearchResults } from '@/types';

import { Container, Divider, Typography } from '@mui/material';
import Grid from '@/components/atoms/AppGrid';

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
            Definition found! Adding more details soon...
        </Container>
    );
};

export default ResultPage;
