'use client';
import { useEffect, useState, createContext, useMemo, ReactNode } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import getTheme from '@/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

export const ColorModeContext = createContext({
    toggleColorMode: (mode?: string) => {},
    mode: (): string => 'light'
});

interface ThemeProviderComponentProps {
    children: ReactNode;
}

const ThemeProviderComponent = ({ children }: ThemeProviderComponentProps) => {
    const [mode, setMode] = useState('light');
    const [mounted, setMounted] = useState(false);
    const rawMode = ['dark', 'light', 'system'].includes(mode) ? mode : 'system';
    const systemTheme = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const handledMode = rawMode === 'system' ? systemTheme : rawMode;

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles?.parentElement) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    useEffect(() => {
        setMode(localStorage.getItem('tlexiconTheme') || 'system');
        setMounted(true);
    }, []);

    const colorMode = useMemo(() => {
        return {
            toggleColorMode: (mode?: string) => {
                setMode((prevMode) => {
                    const nextTheme = mode || (prevMode === 'light' ? 'dark' : 'light');
                    localStorage?.setItem('tlexiconTheme', nextTheme);
                    return nextTheme;
                });
            },
            mode: () => {
                return rawMode;
            }
        };
    }, [rawMode]);

    const theme = useMemo(() => {
        // convert to PaletteMode
        const mode = handledMode as PaletteMode;
        const currentTheme = getTheme(mode);
        return currentTheme;
    }, [handledMode]);

    return (
        <div style={{ visibility: mounted ? 'visible' : 'hidden' }} className="myWrapper">
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <ColorModeContext.Provider value={colorMode}>{children}</ColorModeContext.Provider>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </div>
    );
};

export default ThemeProviderComponent;
