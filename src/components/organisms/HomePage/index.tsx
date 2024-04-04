'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

import { Container, Typography, Divider, Chip } from '@mui/material';
import Grid from '@/components/atoms/AppGrid';
import { getFavorites } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectFavoriteLexicons, setFavoriteLexicons } from '@/redux/reducers/favoriteLexicons';

const HomePage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const favoriteLexicons = useAppSelector(selectFavoriteLexicons);

    useEffect(() => {
        const favorites = getFavorites();
        dispatch(setFavoriteLexicons(Array.isArray(favorites) ? favorites.reverse() : []));
    }, [dispatch]);

    return (
        <Container maxWidth="md" ref={containerRef}>
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
                {favoriteLexicons?.length > 0 && (
                    <Grid xs={12} container>
                        <Grid xs={12}>
                            <Typography variant="h6" component="h2">
                                Favorite Words
                            </Typography>
                        </Grid>
                        {favoriteLexicons.map((word, index) => (
                            <Grid key={index}>
                                <Chip label={word} component={Link} href={`/search/${word}`} clickable />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default HomePage;
