import React from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';

const LoadingSearch = () => {
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>Searching for this word</Typography>
            <CircularProgress size={20} />
        </Stack>
    );
};

export default LoadingSearch;
