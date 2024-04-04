import { useDispatch, useSelector, useStore } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';

import searchResultsReducer from '@/redux/reducers/searchResults';
import favoriteLexiconsReducer from '@/redux/reducers/favoriteLexicons';

export const makeStore = () => {
    return configureStore({
        reducer: {
            searchResults: searchResultsReducer,
            favoriteLexicons: favoriteLexiconsReducer
        }
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppStore: () => AppStore = useStore;
