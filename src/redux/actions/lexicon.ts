import { SearchResults, SearchResultsSupabase } from '@/types';
import { Dispatch } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { setSearchResults } from '../reducers/searchResults';
import { setFavoriteLexicons, toggleFavoriteLexicon } from '../reducers/favoriteLexicons';
import { requestLogin } from '../reducers/auth';
import { Logger } from '@/types/decorators';
import { setAuthStatus } from '../reducers/authStatus';
import { AuthStatus } from '@/hooks/use-init';

type ReturnType = (dispatch: Dispatch) => Promise<void>;

const PERSIST_URL = '/api/supabase/lexicon/persist';
const FAVORITE_URL = '/api/supabase/lexicon/add-to-favorite';
const GET_FAVORITES_URL = '/api/supabase/lexicon/get-favorite-lexicons';
const CLEAR_FAVORITES_URL = '/api/supabase/lexicon/clear-favorites';

const LOG_PREFIX = 'Persist';

class Lexicon {
    constructor() {}

    persistWordToDatabaseAndStore(word: string, searchResults: SearchResults): ReturnType;
    persistWordToDatabaseAndStore(words: SearchResultsSupabase[]): ReturnType;
    @Logger(LOG_PREFIX)
    persistWordToDatabaseAndStore(arg1: unknown, arg2?: unknown): ReturnType {
        try {
            if (Array.isArray(arg1)) {
                if (arg1.length === 0) {
                    throw new Error('No words to persist');
                }
                return async (_: Dispatch) => {
                    return await axios.post(PERSIST_URL, arg1).then((_) => {
                        console.log(`${LOG_PREFIX} Persisted!`);
                    });
                };
            }

            if (typeof arg1 === 'string' && Array.isArray(arg2)) {
                return async (dispatch: Dispatch) => {
                    return await axios
                        .post(PERSIST_URL, {
                            word: arg1,
                            searchResults: arg2
                        })
                        .then((_) => {
                            console.log(`${LOG_PREFIX} Persisted!`);
                            dispatch(setSearchResults({ word: arg1 as string, results: arg2 as SearchResults }));
                        });
                };
            }

            return async (_: Dispatch) => {
                console.log(`${LOG_PREFIX} Skipping...`);
            };
        } catch (error) {
            return async (_: Dispatch) => {};
        }
    }

    @Logger(LOG_PREFIX)
    toggleAndPersistFavoriteLexicon(word: string): ReturnType {
        return async (dispatch: Dispatch) => {
            return await axios
                .post(FAVORITE_URL, { word }, { withCredentials: true })
                .then((response) => {
                    // if unauthorized, request login
                    if (response.status === 401) {
                        dispatch(requestLogin({ callbackUrl: `/search/${word}?favorite=toggle` }));
                    } else {
                        dispatch(toggleFavoriteLexicon({ word, state: response.data.currentState }));
                    }
                })
                .catch((error: AxiosError) => {
                    if (error.response?.status === 401) {
                        dispatch(requestLogin({ callbackUrl: `/search/${word}?favorite=toggle` }));
                    }
                });
        };
    }

    @Logger(LOG_PREFIX)
    getFavorites(): ReturnType {
        return async (dispatch: Dispatch) => {
            dispatch(setAuthStatus(AuthStatus.Loading));
            return await axios
                .get(GET_FAVORITES_URL, { withCredentials: true })
                .then((response) => {
                    dispatch(setFavoriteLexicons(response.data?.map((r: { lexicon: string }) => r.lexicon) ?? []));
                })
                .catch((_: AxiosError) => {})
                .finally(() => {
                    dispatch(setAuthStatus(AuthStatus.Loaded));
                });
        };
    }

    clearFavorites(): ReturnType {
        return async (dispatch: Dispatch) => {
            return await axios
                .delete(CLEAR_FAVORITES_URL, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    dispatch(setFavoriteLexicons([]));
                })
                .catch((error: AxiosError) => {
                    console.error(error);
                });
        };
    }
}

const lexicon = new Lexicon();

const persistWordToDatabaseAndStore = lexicon.persistWordToDatabaseAndStore;
const toggleAndPersistFavoriteLexicon = lexicon.toggleAndPersistFavoriteLexicon;
const getFavorites = lexicon.getFavorites;
const clearFavorites = lexicon.clearFavorites;

export { persistWordToDatabaseAndStore, toggleAndPersistFavoriteLexicon, getFavorites, clearFavorites };
