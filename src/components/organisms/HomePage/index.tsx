'use client';

import { useRef } from 'react';
import Link from 'next/link';

import { Container, Typography, Divider, Chip, Button } from '@mui/material';
import Grid from '@/components/atoms/AppGrid';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectFavoriteLexicons } from '@/redux/reducers/favoriteLexicons';
import { requestLogin, selectLoggedInStatus } from '@/redux/reducers/auth';

const HomePage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const favoriteLexicons = useAppSelector(selectFavoriteLexicons);
    const loggedIn = useAppSelector(selectLoggedInStatus);
    const dispatch = useAppDispatch();

    const handleRequestLogin = () => {
        dispatch(requestLogin({ callbackUrl: '/' }));
    };

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
                <Grid xs={12} container>
                    <Grid xs={12}>
                        <Typography variant="h6" component="h2">
                            Favorite Words
                        </Typography>
                    </Grid>
                    {!loggedIn && (
                        <Grid xs={12}>
                            <Typography variant="body2">
                                Login to see your favorite lexicons.{' '}
                                <Typography
                                    variant="body2"
                                    component="span"
                                    onClick={handleRequestLogin}
                                    className="cursor-pointer italic underline underline-offset-4"
                                >
                                    Click to login.
                                </Typography>
                            </Typography>
                        </Grid>
                    )}
                    {favoriteLexicons?.length > 0 &&
                        favoriteLexicons.map((word, index) => (
                            <Grid key={index}>
                                <Chip label={word} component={Link} href={`/search/${word}`} clickable />
                            </Grid>
                        ))}
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomePage;
