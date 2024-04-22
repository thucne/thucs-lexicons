import { useEffect, useRef, useState } from 'react';
import { useHoveredText, useOnHoveredText } from '@/hooks/use-listener';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import AppMenu from '@/components/atoms/AppMenu';
import { getFreeDictionaryLexicons, getSupabaseLexicons } from '@/utils';
import { SearchResult, SearchResultsSupabase } from '@/types';
import { useAppDispatch } from '@/redux/store';
import { persistWordToDatabaseAndStore } from '@/redux/reducers/favoriteLexicons';

const QuickMeaning = () => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [meaning, setMeaning] = useState<SearchResult | undefined>(undefined);

    const disableOnLeave = useRef(false);

    const [hoveredTextRaw, hoveredTextElement, setHoveredText, setHoveredTextElement] = useOnHoveredText({
        delay: 500,
        delayOnLeave: true,
        filterClassName: 'lexicon'
    });

    const hoveredText = hoveredTextRaw?.split(/\W+/).filter((word) => word.length > 0)?.[0];

    const resetMenu = () => {
        setHoveredText('');
        setHoveredTextElement(null);
        setMeaning(undefined);
    };

    useEffect(() => {
        if (hoveredText) {
            disableOnLeave.current = true;
        }
    }, [hoveredText]);

    useEffect(() => {
        const lexicons = document.querySelectorAll('.lexicon');
        lexicons.forEach((lexicon) => {
            lexicon.classList.remove('underline');
        });

        if (hoveredTextElement) {
            hoveredTextElement.classList.add('underline');
        }
    }, [hoveredText, hoveredTextElement]);

    useEffect(() => {
        const fetchMeaning = async () => {
            let results;

            const responseFromSupabase: SearchResultsSupabase[] = await getSupabaseLexicons([hoveredText!]);
            const foundWord = responseFromSupabase.find((result) => result.word === hoveredText);

            if (foundWord) {
                results = foundWord.searchResults;
            } else {
                const fetchedResults = await getFreeDictionaryLexicons([hoveredText!]);
                results = fetchedResults?.[0]?.searchResults;
                dispatch(persistWordToDatabaseAndStore(fetchedResults));
            }

            setMeaning(results?.[0]);
        };

        if (hoveredText) {
            setIsLoading(true);
            fetchMeaning().finally(() => {
                setIsLoading(false);
            });
        }
    }, [hoveredText, dispatch]);

    if (!hoveredTextElement) return null;

    return (
        <AppMenu
            menuId="quick-meaning"
            anchorEl={hoveredTextElement}
            anchorElId="quick-meaning-anchorId"
            onClose={resetMenu}
            onMouseLeave={resetMenu}
        >
            <Box px={1.5} py={0.5}>
                {isLoading && (
                    <Typography variant="body2" color="info.main" sx={{ maxWidth: 220 }}>
                        <CircularProgress size={14} className="m-auto mr-2 align-middle" />
                        Loading &quot;{hoveredText}&quot; definition...
                    </Typography>
                )}
                {hoveredText && !isLoading && meaning && (
                    <Stack direction="column" spacing={0.5}>
                        <Typography variant="h6">{meaning.word}</Typography>
                        <Typography variant="caption" component="span" color="textSecondary">
                            <Typography variant="caption" component="span" color="text.primary">
                                {meaning.meanings?.[0]?.partOfSpeech}
                            </Typography>{' '}
                            - {meaning.phonetics?.[0]?.text}
                        </Typography>
                        <Typography variant="body2">{meaning.meanings?.[0]?.definitions?.[0]?.definition}</Typography>
                    </Stack>
                )}
                {hoveredText && !isLoading && !meaning && (
                    <Typography variant="body2" color="warning.main">
                        No definition found for &quot;{hoveredText}&quot;
                    </Typography>
                )}
            </Box>
        </AppMenu>
    );
};

export default QuickMeaning;
