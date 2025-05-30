'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

import { Box, CircularProgress, Container, Divider, Typography } from '@mui/material';
import { SearchResults } from '@/types';
import { createUrl } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { SearchResultsState, selectSearchResults } from '@/redux/reducers/searchResults';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeRounded';

import MeaningGroup from './MeaningGroup';
import { useLexicon, useLexiconWithAI } from '@/hooks/use-lexicon';
import { persistWordToDatabaseAndStore } from '@/redux/actions/lexicon';
import ToggleFavorite from './ToggleFavorite';
import QuickMeaning from './QuickMeaning';
import Link from 'next/link';
import Grid2 from '@mui/material/Unstable_Grid2';

type ResultPageProps = {
    word: string;
    supabaseLexicon: SearchResults;
};

type IsAvailableResponse = [boolean, SearchResults | undefined];

const isAvailableFromSupabase = (word: string, supabaseLexicon: SearchResults): IsAvailableResponse => {
    const isAvailable = word ? word?.length > 0 && supabaseLexicon?.length > 0 : false;
    return [isAvailable, isAvailable ? supabaseLexicon : undefined];
};

const isAvailableFromStore = (word: string, store: SearchResultsState): IsAvailableResponse => {
    const isAvailable = Boolean(store?.word === word && store?.results?.length > 0);

    return [isAvailable, isAvailable ? store.results : undefined];
};

const ResultPage = ({ word: rawWord, supabaseLexicon }: ResultPageProps) => {
    const word = decodeURIComponent(rawWord);

    const dispatch = useAppDispatch();
    const searchResultsFromStore = useAppSelector(selectSearchResults);

    const [inSupabase, resultsFromSupabase] = isAvailableFromSupabase(word, supabaseLexicon);
    const [inStore, resultsFromStore] = isAvailableFromStore(word, searchResultsFromStore);

    // if failed to fetch from store, fetch from API
    const shouldFetch = !inSupabase && !inStore;
    const { data: resultsFromFetch, isLoading } = useLexicon(shouldFetch ? word : '');
    const shouldFetchWithAI = shouldFetch && !resultsFromFetch?.length;
    const shouldRefetchWithAI = resultsFromSupabase && resultsFromSupabase?.some(result => {
        // if correctedWord is mistakenly filled by AI as phonetic, we should not refetch with AI
        // something like IPA /ˈɡoʊɪŋ/
        const isPhoneticRegex = /^[/\[]?[ˈˌa-zA-Zɪʊəɔɛæʌθðŋʃʒɑ̃ɾɫɹɝɜːː̃ʔ. ]+[\/\]]?$/;
        return result.openai && isPhoneticRegex.test(result.correctedWord || '');
    })

    const { data: resultsFromAIRaw, isLoading: isAILoading } = useLexiconWithAI(shouldFetchWithAI || shouldRefetchWithAI ? word : '');

    const resultsFromAI = resultsFromAIRaw?.definitions;
    const results = (resultsFromAI || resultsFromFetch || resultsFromStore || resultsFromSupabase) as SearchResults;

    useEffect(() => {
        if (resultsFromFetch?.length) {
            dispatch(persistWordToDatabaseAndStore(word, resultsFromFetch));
        }
        if (resultsFromAI?.length) {
            dispatch(persistWordToDatabaseAndStore(word, resultsFromAI));
        }
    }, [resultsFromFetch, resultsFromAI, word, dispatch]);

    if (isLoading) {
        return <div>Fetching data...</div>;
    }

    if (isAILoading) {
        return (
            <Grid2 container alignItems="center" justifyContent="center" spacing={1} className="px-10">
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="awesomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff0800" /> {/* violet-700 */}
                            <stop offset="50%" stopColor="#fcb900" /> {/* lime-300 */}
                            <stop offset="100%" stopColor="#abbe00" />
                        </linearGradient>
                    </defs>
                </svg>
                <Grid2><span>Let&apos;s see if the AI friend</span></Grid2>
                <Grid2>
                    <Box sx={{ m: 1, position: 'relative' }} className="inline-grid">
                        <AutoAwesomeIcon sx={{ fill: 'url(#awesomeGradient)' }} />
                        <CircularProgress
                            sx={{
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                zIndex: 1
                            }}
                            color="warning"
                        />
                    </Box>
                </Grid2>
                <Grid2>
                    <span>could help us with this...</span>
                </Grid2>
            </Grid2>
        );
    }

    // if the word is not found in the API, results would be an object
    // {
    //     "title": "No Definitions Found",
    //     "message": "Sorry pal, we couldn't find definitions for the word you were looking for.",
    //     "resolution": "You can try the search again at later time or head to the web instead."
    // }
    if (!Array.isArray(results)) {
        redirect(createUrl('/search', new URLSearchParams({ word })));
    }

    const isByAI = resultsFromAI?.length > 0 || results?.some((result) => result.openai);

    return (
        <Container maxWidth="md">
            <QuickMeaning />
            <Typography variant="caption" component="h1" gutterBottom className="italic">
                Meaning of <b>{word}</b> in English | Powered by{' '}
                {isByAI ? (
                    <Link
                        href="https://platform.openai.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} // gap adds spacing
                    >
                        OpenAI
                        <svg width="0" height="0">
                            <defs>
                                <linearGradient id="awesomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ff0800" />
                                    <stop offset="50%" stopColor="#fcb900" />
                                    <stop offset="100%" stopColor="#abbe00" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <AutoAwesomeIcon sx={{ fill: 'url(#awesomeGradient)' }} fontSize="small" />
                    </Link>
                ) : (
                    <Link
                        href="https://dictionaryapi.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                    >
                        Free Dictionary API
                    </Link>
                )}
                {isByAI && (
                    <span className="text-xs text-yellow-500">
                        {' '}
                        - which may not be accurate or reliable, please use with caution.
                    </span>
                )}
            </Typography>
            <ToggleFavorite word={word} />
            {results.map((result, index) => [
                <MeaningGroup
                    key={`${word}-meaning-${index}`}
                    id={`${word}-meaning-group-${index}`}
                    meaning={result}
                    word={word}
                />,
                <Divider key={`${word}-divider-${index}`} className="my-4" />
            ])}
        </Container>
    );
};

export default ResultPage;
