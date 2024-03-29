import { SearchResults } from "@//types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";

const initState: SearchResults = [];

export const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState: initState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<SearchResults>) => {
      return action.payload;
    },
    clearSearchResults: () => {
      return initState;
    },
  },
});

export const { setSearchResults, clearSearchResults } =
  searchResultsSlice.actions;
export const selectSearchResults = (state: AppState) => state.searchResults;

export default searchResultsSlice.reducer;
