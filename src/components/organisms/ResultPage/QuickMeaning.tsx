import { useEffect, useState } from 'react';
import { useListener, useOnHoveredText } from '@/hooks/use-listener';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import AppMenu from '@/components/atoms/AppMenu';
import { getFreeDictionaryLexicons, getSupabaseLexicons } from '@/utils';
import { SearchResult, SearchResultsSupabase } from '@/types';
import { useAppDispatch } from '@/redux/store';
import { persistWordToDatabaseAndStore } from '@/redux/reducers/favoriteLexicons';
import { RightIcon } from '@/components/atoms/AppIcons';
import Link from 'next/link';
import Audio from '@/components/molecules/Audio';

const QuickMeaning = () => {
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [meaning, setMeaning] = useState<SearchResult | undefined>(undefined);

    const [hoveredTextRaw, hoveredTextElement, setHoveredTextElement] = useOnHoveredText({
        delay: 500,
        delayOnLeave: true,
        filterClassName: 'lexicon'
    });
    const hoveredText = hoveredTextRaw?.split(/\W+/).filter((word) => word.length > 0)?.[0];

    const resetMenu = () => {
        setHoveredTextElement(null);
        setMeaning(undefined);
    };

    useListener({
        eventName: 'mouseleave',
        callback: resetMenu,
        elementSelector: '#quick-meaning .MuiPaper-root',
        dependencies: [hoveredTextElement]
    });

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

    return (
        <AppMenu
            menuId="quick-meaning"
            anchorEl={hoveredTextElement}
            anchorElId="quick-meaning-anchorId"
            onClose={resetMenu}
        >
            <Box
                className="transition-all duration-500"
                sx={{
                    height: hoveredText ? 'auto' : 0,
                    px: hoveredText ? 1.5 : 0,
                    py: hoveredText ? 0.5 : 0
                }}
            >
                {isLoading && (
                    <Typography variant="body2" color="info.main" sx={{ maxWidth: 250 }}>
                        <CircularProgress size={14} className="m-auto mr-2 align-middle" />
                        Loading... Please wait
                    </Typography>
                )}
                {hoveredText && !isLoading && meaning && (
                    <Stack direction="column" spacing={0.5}>
                        <Typography variant="h6">{meaning.word}</Typography>
                        <Typography
                            variant="caption"
                            component="span"
                            color="textSecondary"
                            className="flex items-center gap-1"
                        >
                            <Typography variant="caption" component="span" color="text.primary">
                                {meaning.meanings?.[0]?.partOfSpeech}
                            </Typography>
                            {meaning.phonetics?.[0]?.text && (
                                <Typography variant="caption" component="span">
                                    - {meaning.phonetics?.[0]?.text}
                                </Typography>
                            )}
                            {meaning.phonetics?.[0] && (
                                <>
                                    <Typography variant="caption" component="span">
                                        -
                                    </Typography>
                                    <Audio
                                        phonetic={meaning.phonetics[0]}
                                        showPhonetic={false}
                                        sx={{ display: 'inline-block' }}
                                        buttonSx={{
                                            py: 0,
                                            ':hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    />
                                </>
                            )}
                        </Typography>
                        <Typography variant="body2">{meaning.meanings?.[0]?.definitions?.[0]?.definition}</Typography>
                    </Stack>
                )}
                {hoveredText && !isLoading && !meaning && (
                    <Typography variant="body2" color="warning.main">
                        No definition found for &quot;{hoveredText}&quot;
                    </Typography>
                )}
                {hoveredText && !isLoading && meaning && (
                    <Box className="mt-3 flex justify-end">
                        <Button
                            disableRipple
                            sx={{
                                textTransform: 'none',
                                ':hover': {
                                    backgroundColor: 'transparent',
                                    '.MuiSvgIcon-root': {
                                        transform: 'translateX(5px)',
                                        transition: 'transform 0.2s'
                                    }
                                }
                            }}
                            endIcon={<RightIcon />}
                            LinkComponent={Link}
                            href={`/search/${meaning.word}`}
                        >
                            Go to this word
                        </Button>
                    </Box>
                )}
            </Box>
        </AppMenu>
    );
};

export default QuickMeaning;
