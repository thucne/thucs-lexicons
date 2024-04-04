import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';

const initState: string[] = [];

export const favoriteLexiconsSlice = createSlice({
    name: 'favoriteLexicons',
    initialState: initState,
    reducers: {
        toggleFavoriteLexicon: (state, action) => {
            const word = action.payload;
            const nextState = state.includes(word) ? state.filter((w) => w !== word) : [word, ...state];
            return nextState;
        },
        setFavoriteLexicons: (state, action) => {
            return action.payload;
        },
        clearFavoriteLexicons: () => {
            return initState;
        }
    }
});

export const { toggleFavoriteLexicon, setFavoriteLexicons, clearFavoriteLexicons } = favoriteLexiconsSlice.actions;
export const selectFavoriteLexicons = (state: AppState) => state.favoriteLexicons;

export default favoriteLexiconsSlice.reducer;
