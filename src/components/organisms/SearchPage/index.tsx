'use client';
import { redirect } from 'next/navigation';

import { useLexicon, useLexiconWithAICheck } from '@/hooks/use-lexicon';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { SearchResultsState, selectSearchResults, setSearchResults } from '@/redux/reducers/searchResults';
import { Box, CircularProgress, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

type SearchPageProps = {
    word: string;
};

const SearchPageBody = ({ word }: SearchPageProps) => {
    const resultsFromStore: SearchResultsState = useAppSelector(selectSearchResults);
    const dispatch = useAppDispatch();

    const existed = resultsFromStore.word === word && resultsFromStore.results;

    const { data, error, isLoading } = useLexicon(!existed ? word : undefined, {
        onSuccess: (data) => {
            dispatch(setSearchResults({ word, results: data }));
        }
    });
    const shouldFetchWithAI = !data?.length;
    const { data: resultsFromAI, isLoading: isAILoading } = useLexiconWithAICheck(shouldFetchWithAI ? word : '');
    const hasAIData = resultsFromAI?.value;

    if (isLoading) {
        return (
            <Typography className="flex items-center gap-2">
                Fetching data
                <CircularProgress size={16} />
            </Typography>
        );
    }

    if (isAILoading) {
        return (
            <div className="flex items-center gap-2">
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="awesomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff0800" /> {/* violet-700 */}
                            <stop offset="50%" stopColor="#fcb900" /> {/* lime-300 */}
                            <stop offset="100%" stopColor="#abbe00" />
                        </linearGradient>
                    </defs>
                </svg>
                Trying to find meaning with AI{' '}
                <Box sx={{ m: 1, position: 'relative' }}>
                    <AutoAwesomeIcon sx={{ fill: 'url(#awesomeGradient)' }} fontSize="small" />
                    <CircularProgress
                        sx={{
                            position: 'absolute',
                            top: -4,
                            left: -4,
                            zIndex: 1
                        }}
                        color="warning"
                        size={32}
                    />
                </Box>
            </div>
        );
    }

    if (error) {
        throw new Error('Failed to fetch data');
    }

    if (!word) {
        return <div>Try to search for a word!</div>;
    }

    const results = data || resultsFromStore.results;

    if (!hasAIData && !Array.isArray(results)) {
        return (
            <div>
                <b>&quot;{word}&quot;</b> not found!
            </div>
        );
    }

    redirect(`/search/${word}`);
};

export default SearchPageBody;
