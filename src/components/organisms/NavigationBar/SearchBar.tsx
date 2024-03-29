'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { TextField } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { createUrl } from '@/utils';

const BootstrapInput = styled(TextField)(({ theme }) => ({
    width: '100%',
    'label + &': {
        marginTop: theme.spacing(3)
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
        fontSize: 16,
        width: '100%',
        padding: '8px 12px',
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
        ].join(','),
        '&:focus': {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main
        }
    }
}));

const SearchBar = () => {
    const searchRef = useRef<HTMLInputElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    /**
     * >>> This is an example of destructuring assignment,
     *    it allows you to unpack values from arrays, or properties from objects, into distinct variables.
     *    in this case, useState returns
     */
    const [search, setSearch] = useState('');

    const searchFromUrl = searchParams.get('q');

    useEffect(() => {
        setSearch(searchFromUrl || '');
    }, [searchFromUrl]);

    useEffect(() => {
        // run on next execution loop, so focus() works

        /**
         * >>> This is not recommended as it manipulates the DOM directly,
         *       using refs is the recommended way to interact with the DOM in React.
         */
        // const searchInputEl = document.getElementById("search-input");

        // if (searchInputEl) {
        //   setTimeout(() => {
        //     searchInputEl.focus();
        //   }, 0);
        // }

        // This is a better way to focus on an element, however, you may find that it doesn't work in development mode
        // So, this works on production mode
        searchRef.current?.focus();

        /**
         * This way works on development mode, however, consider using the above method for simplicity, readability, and efficiency
         * - setTimeout with 0ms delay is used to run the function on the next execution loop, so focus() works
         */
        // setTimeout(() => {
        //   if (searchRef.current) {
        //     searchRef.current.focus();
        //   }
        // }, 0);
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
            newParams.set('q', search);
        } else {
            newParams.delete('q');
        }

        router.push(createUrl('/', newParams));
    };

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
            />
        </form>
    );
};

export default SearchBar;
