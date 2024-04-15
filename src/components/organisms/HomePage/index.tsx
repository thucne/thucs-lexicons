'use client';

import { Container, Typography, Divider } from '@mui/material';
import Grid from '@/components/atoms/AppGrid';
import FavoriteWords from './FavoriteWords';

const HomePage = () => {
    return (
        <Container maxWidth="md">
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <Typography variant="h4" component="h1">
                        Welcome to My Lexicons
                    </Typography>
                </Grid>
                <Grid xs={12} my={1}>
                    <Divider />
                </Grid>
                <Grid xs={12}>
                    <Typography className="italic">Try to seach for a word in the search bar above!</Typography>
                </Grid>
                <Grid xs={12}>
                    <FavoriteWords />
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomePage;
