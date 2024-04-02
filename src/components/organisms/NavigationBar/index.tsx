'use client';

import { useState } from 'react';

import Image from 'next/image';

import Grid from '@/components/atoms/AppGrid';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import ThemeSelect from '@/components/molecules/ThemeSelect';
import SearchBar from '@/components/organisms/NavigationBar/SearchBar';
import { SearchIcon, CloseIcon } from '@/components/atoms/AppIcons';
import Link from 'next/link';

const NavigationBar = () => {
    const theme = useTheme();
    const [openSearchInput, setOpenSearchInput] = useState(false);

    const toggleSearchInput = () => setOpenSearchInput((prev) => !prev);

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                            Thuc&apos;s Lexicons
                        </Typography>
                    </Grid>
                </Grid>
                <Grid xs display="flex" justifyContent={{ xs: 'flex-end', sm: 'center' }}>
                    <div className="hidden sm:contents">
                        <div className="w-full max-w-[400px]">
                            <SearchBar />
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
