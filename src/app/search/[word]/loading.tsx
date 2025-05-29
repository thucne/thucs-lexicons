import React from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';

const LoadingLexicon = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>
                Anytime now...
            </Typography>
            <CircularProgress size={20} />
        </Stack>
    );
};

export default LoadingLexicon;
