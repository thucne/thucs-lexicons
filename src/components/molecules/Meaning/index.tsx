import React from 'react';

import { Meaning } from '@/types';
import Grid from '@/components/atoms/AppGrid';

import { Box, Typography } from '@mui/material';
import Definition from './Definition';
import Thesaurus from './Thesaurus';

type MeaningProps = {
    meaning: Meaning;
    index: number;
    word: string;
};

const MeaningComponent = ({ meaning, index, word }: MeaningProps) => {
    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Typography className="font-bold italic">{meaning.partOfSpeech}</Typography>
            </Grid>

            <Grid xs={12}>
                <Box component="ul" my={0}>
                    {meaning.definitions.map((definition, definitionIndex) => {
                        return (
                            <Definition
                                key={`${meaning.partOfSpeech}-definition-${definitionIndex}`}
                                word={word}
                                definition={definition}
                                index={index + definitionIndex}
                            />
                        );
                    })}
                </Box>
            </Grid>

            <Grid xs={12}>
                <Thesaurus word={word} antonyms={meaning.antonyms} synonyms={meaning.synonyms} autoExpand={index === 0} />
            </Grid>
        </Grid>
    );
};

export default MeaningComponent;
