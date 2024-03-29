'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import components from './overrides';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap'
});

const theme = (mode: PaletteMode) =>
    createTheme({
        palette: {
            mode
        },
        typography: {
            fontFamily: roboto.style.fontFamily
        },
        components
    });

export default theme;
