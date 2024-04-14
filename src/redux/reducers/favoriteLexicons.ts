import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import {
    persistWordToDatabaseAndStore as persistWordToDatabaseAndStoreAction,
    toggleAndPersistFavoriteLexicon as toggleAndPersistFavoriteLexiconAction,
    getFavorites as getFavoritesAction
} from '../actions/lexicon';

const initState: string[] = [];

export const favoriteLexiconsSlice = createSlice({
    name: 'favoriteLexicons',
    initialState: initState,
    reducers: {
        toggleFavoriteLexicon: (state, action: PayloadAction<{ word: string; state?: boolean }>) => {
            const word = action.payload.word;
            const forceState = action.payload.state ?? undefined;

            if (forceState !== undefined) {
                return forceState ? [...state, word] : state.filter((w) => w !== word);
            }

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
export const toggleAndPersistFavoriteLexicon = toggleAndPersistFavoriteLexiconAction;
export const getFavorites = getFavoritesAction;

export default favoriteLexiconsSlice.reducer;
