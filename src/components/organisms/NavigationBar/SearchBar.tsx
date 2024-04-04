'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Box, InputAdornment, TextField, useMediaQuery } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { createUrl } from '@/utils';

const BootstrapInput = styled(TextField)(({ theme }) => ({
    width: '100%',
    'label + &': {
        marginTop: theme.spacing(3)
    },
    '& .MuiInputBase-root': {
        paddingRight: theme.spacing(1),
        '*': {
            borderColor: theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[800]
        }
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        fontSize: 16,
        width: '100%',
        padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(',')
    }
}));

const InputEndAdornment = styled(Box)(({ theme }) => ({
    color: alpha(theme.palette.text.primary, 0.5),
    fontSize: 12,
    padding: theme.spacing(0, 1),
    border: `1px solid yellow`,
    borderRadius: theme.shape.borderRadius
}));

const SearchBar = () => {
    const searchRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    /**
     * >>> This is an example of destructuring assignment,
     *    it allows you to unpack values from arrays, or properties from objects, into distinct variables.
     *    in this case, useState returns
     */
    const [search, setSearch] = useState('');

    const searchFromParams = searchParams.get('word');
    // or the word is from /search/<word>
    const searchFromPath = /^\/search\/([^/]+)$/.exec(pathname)?.[1];

    useEffect(() => {
        setSearch(decodeURIComponent(searchFromParams || searchFromPath || ''));
    }, [searchFromParams, searchFromPath]);

    useEffect(() => {
        searchRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        /**
         * >>> This is an example of type assertion, it tells the compiler that the value is of a specific type.
         *     However, we need to be careful when using type assertions, as it can lead to runtime errors if the type assertion is incorrect.
         *          In this case, we are asserting that e.target is an HTMLFormElement.
         *                              and e.target.search is an HTMLInputElement.
         */
        // const val = e.target as HTMLFormElement;
        // const search = val.search as HTMLInputElement;
        // const searchValue = search.value;

        const newParams = new URLSearchParams(searchParams.toString());

        /**
         * >>> This is an example of variable lookup, JS will look for a variable named `search` in the current scope,
         *      this then will look for a variable named `search` in the parent scope, and so on until it reaches the global scope.
         *      In this case, the variable `search` is declared in the parent scope, so it will be used.
         *          Line 52
         */
        if (search) {
            newParams.set('word', search);
        } else {
            newParams.delete('word');
        }

        router.push(createUrl('/search', newParams));
    };

    useEffect(() => {
        // on key Ctrl+K pressed, trigger search button click
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                e.stopPropagation();

                searchRef.current?.focus();
            }
        };

        if (!isMobile) window.addEventListener('keydown', handleKeyPress);

        return () => {
            if (!isMobile) window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isMobile]);

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <BootstrapInput
                id="search-input"
                name="search"
                placeholder="Hallucinate"
                value={search}
                /**
                 * >>> Functions are treated as first-class citizens in JavaScript,
                 *      they can be passed around as arguments to other functions
                 */
                onChange={(e) => setSearch(e.target.value)}
                inputRef={searchRef}
                InputProps={{
                    endAdornment: !isMobile ? (
                        <InputAdornment position="end">
                            <InputEndAdornment component="span">Ctrl + K</InputEndAdornment>
                        </InputAdornment>
                    ) : undefined
                }}
            />
        </form>
    );
};

export default SearchBar;
