import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { persistWordToDatabaseAndStore as persistWordToDatabaseAndStoreAction } from '../actions/lexicon';

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
        setFavoriteLexicons: (_, action) => {
            return action.payload;
        },
        clearFavoriteLexicons: () => {
            return initState;
        }
    }
});

export const { toggleFavoriteLexicon, setFavoriteLexicons, clearFavoriteLexicons } = favoriteLexiconsSlice.actions;
export const selectFavoriteLexicons = (state: AppState) => state.favoriteLexicons;
export const persistWordToDatabaseAndStore = persistWordToDatabaseAndStoreAction;

export default favoriteLexiconsSlice.reducer;
