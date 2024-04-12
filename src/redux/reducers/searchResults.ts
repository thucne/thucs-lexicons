import { SearchResults } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store';

export type SearchResultsState = {
    word: string;
    results: SearchResults;
};

const initState: SearchResultsState = {
    word: '',
    results: []
};

export const searchResultsSlice = createSlice({
    name: 'searchResults',
    initialState: initState,
    reducers: {
        setSearchResults: (_, action: PayloadAction<SearchResultsState>) => {
            return action.payload;
        },
        clearSearchResults: () => {
            return initState;
        }
    }
});

export const { setSearchResults, clearSearchResults } = searchResultsSlice.actions;
export const selectSearchResults = (state: AppState) => state.searchResults;

export default searchResultsSlice.reducer;
