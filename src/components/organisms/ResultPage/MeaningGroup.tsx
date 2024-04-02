import React from 'react';

import { SearchResult } from '@/types';
import { Chip, Divider, Typography } from '@mui/material';

import Grid from '@/components/atoms/AppGrid';
import Audio from '@/components/molecules/Audio';
import { getLicenseString } from '@/utils';

type MeaningGroupProps = {
    meaning: SearchResult;
};

const MeaningGroup = ({ meaning }: MeaningGroupProps) => {
    console.log(meaning);

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Typography variant="h4" component="h2" title={getLicenseString(meaning.license)}>
                    {meaning.word}
                </Typography>
            </Grid>
            <Grid xs={12} container alignItems="center" spacing={0.5}>
                <Grid xs={12}>
                    <Typography variant="h6" component="h3">
                        {meaning.phonetic}
                    </Typography>
                </Grid>
                <Grid>
                    <Typography>Phonetics</Typography>
                </Grid>
                {meaning.phonetics?.map((phonetic, phoneticIndex) => {
                    return (
                        <Grid key={`${meaning.word}-phonetic-${phoneticIndex}`}>
                            <Audio phonetic={phonetic} />
                        </Grid>
                    );
                })}
            </Grid>
            <Grid xs={12}>
                <Divider
                    sx={{
                        '&.MuiDivider-root::before, &.MuiDivider-root::after': {
                            borderTopColor: (theme) => theme.palette.warning.main
                        }
                    }}
                    textAlign="right"
                >
                    <Chip label="OK" color="warning" clickable />
                </Divider>
            </Grid>
        </Grid>
    );
};

export default MeaningGroup;
