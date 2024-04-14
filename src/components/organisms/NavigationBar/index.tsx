'use client';

import { Suspense, useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Grid from '@/components/atoms/AppGrid';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';

import ThemeSelect from '@/components/molecules/ThemeSelect';
import SearchBar from '@/components/organisms/NavigationBar/SearchBar';
import { SearchIcon, CloseIcon } from '@/components/atoms/AppIcons';
import { useAppDispatch } from '@/redux/store';
import { getFavorites } from '@/redux/reducers/favoriteLexicons';

const NavigationBar = () => {
    const dispatch = useAppDispatch();
    const [openSearchInput, setOpenSearchInput] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const toggleSearchInput = () => setOpenSearchInput((prev) => !prev);

    useEffect(() => {
        dispatch(getFavorites());
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            const threshold = 100;
            if (window.scrollY > threshold) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Box
            p={1}
            /**
             * >>> Example of callback functions usages, pb and borderBottom in this case
             *    are functions that are called with the theme object as an argument.
             *    (The theme object is a global object that contains all the theme variables)
             *        - pb: padding-bottom
             *        - borderBottom: border-bottom
             */
            pb={(theme) => `calc(${theme.spacing(1)} + 1px)`}
            borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
            bgcolor={(theme) => theme.palette.background.paper}
            className={`sticky top-0 z-50 ${isSticky ? 'shadow-md' : ''}`}
        >
            <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
                <Grid xs="auto" container alignItems="center" component={Link} href="/">
                    <Grid xs="auto">
                        <Box className="relative h-10 w-10">
                            <Image src="/logo.svg" alt="logo" fill={true} />
                        </Box>
                    </Grid>
                    <Grid xs>
                        <Typography variant="h6" className="text-base md:text-lg lg:text-xl">
                            My Lexicons
                        </Typography>
                    </Grid>
                </Grid>
                <Grid xs display="flex" justifyContent={{ xs: 'flex-end', sm: 'center' }}>
                    <div className="hidden sm:contents">
                        <div className="w-full max-w-[400px]">
                            <Suspense fallback={<LinearProgress className="w-full" />}>
                                <SearchBar />
                            </Suspense>
                        </div>
                    </div>
                    <IconButton onClick={toggleSearchInput} className="flex sm:hidden">
                        {openSearchInput ? <CloseIcon /> : <SearchIcon />}
                    </IconButton>
                </Grid>
                <Grid xs="auto">
                    <ThemeSelect />
                </Grid>
                <Grid xs={12} display={{ xs: openSearchInput ? 'flex' : 'none', sm: 'none' }}>
                    {openSearchInput && <SearchBar />}
                </Grid>
            </Grid>
        </Box>
    );
};

export default NavigationBar;
