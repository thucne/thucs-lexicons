import React from 'react';

import { Meaning } from '@/types';
import Grid from '@/components/atoms/AppGrid';

import { Box, Typography } from '@mui/material';
import Definition from './Definition';

type MeaningProps = {
    meaning: Meaning;
};

const MeaningComponent = ({ meaning }: MeaningProps) => {
    console.log(meaning);

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
                                definition={definition}
                            />
                        );
                    })}
                </Box>
            </Grid>
        </Grid>
    );
};

export default MeaningComponent;
