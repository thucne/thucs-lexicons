import React from 'react';

import { Meaning } from '@/types';
import Grid from '@/components/atoms/AppGrid';

import { Typography } from '@mui/material';

type MeaningProps = {
    meaning: Meaning;
};

const Meaning = ({ meaning }: MeaningProps) => {
    return (
        <Grid container spacing={2}>
            <Grid>
                <Typography variant="h4" component="h2">
                    AHIHI
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Meaning;
