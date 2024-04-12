import { SearchResults, SearchResultsSupabase } from '@/types';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { setSearchResults } from '../reducers/searchResults';

type ReturnType = (dispatch: Dispatch) => Promise<void>;

const PERSIST_URL = '/api/supabase/lexicon/persist';
const LOG_PREFIX = '[Persist]';

function persistWordToDatabaseAndStore(word: string, searchResults: SearchResults): ReturnType;
function persistWordToDatabaseAndStore(words: SearchResultsSupabase[]): ReturnType;
function persistWordToDatabaseAndStore(arg1: unknown, arg2?: unknown): ReturnType {
    try {
        if (Array.isArray(arg1)) {
            if (arg1.length === 0) {
                throw new Error('No words to persist');
            }
            return async (_: Dispatch) => {
                await axios.post(PERSIST_URL, arg1).then((_) => {
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

export { persistWordToDatabaseAndStore };
