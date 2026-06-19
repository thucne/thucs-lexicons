'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

import Audio from '@/components/molecules/Audio';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { SourceBadge } from '@/components/ui/source-badge';
import { useOnHoveredText } from '@/hooks/use-listener';
import { useLexiconWithAI } from '@/hooks/use-lexicon';
import { SearchResult } from '@/types';
import { getFreeDictionaryLexicons } from '@/utils';

const QuickMeaning = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [meaning, setMeaning] = useState<SearchResult | undefined>(undefined);
    const [useAiFallback, setUseAiFallback] = useState(false);
    const hoveredTextRef = useRef<string | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const popoverContentRef = useRef<HTMLDivElement | null>(null);

    const [hoveredTextRaw, hoveredTextElement, setHoveredTextElement] = useOnHoveredText({
        delay: 1000,
        filterClassName: 'lexicon'
    });
    const hoveredText = hoveredTextRaw?.split(/\W+/).filter((word) => word.length > 0)?.[0] ?? null;

    const { data: aiResults, isLoading: isAiLoading } = useLexiconWithAI(
        useAiFallback && hoveredText ? hoveredText : undefined
    );

    const clearCloseTimer = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    const resetMenu = useCallback(() => {
        clearCloseTimer();
        setHoveredTextElement(null);
        setMeaning(undefined);
        setUseAiFallback(false);
        hoveredTextRef.current = null;
    }, [clearCloseTimer, setHoveredTextElement]);

    const scheduleResetMenu = useCallback(() => {
        clearCloseTimer();
        closeTimerRef.current = setTimeout(resetMenu, 150);
    }, [clearCloseTimer, resetMenu]);

    const handleTargetMouseLeave = useCallback(
        (event: MouseEvent) => {
            const relatedTarget = event.relatedTarget;

            if (relatedTarget instanceof Node && popoverContentRef.current?.contains(relatedTarget)) {
                clearCloseTimer();
                return;
            }

            scheduleResetMenu();
        },
        [clearCloseTimer, scheduleResetMenu]
    );

    useEffect(() => clearCloseTimer, [clearCloseTimer]);

    useEffect(() => {
        if (!hoveredTextElement) {
            return;
        }

        hoveredTextElement.addEventListener('mouseenter', clearCloseTimer);
        hoveredTextElement.addEventListener('mouseleave', handleTargetMouseLeave);

        return () => {
            hoveredTextElement.removeEventListener('mouseenter', clearCloseTimer);
            hoveredTextElement.removeEventListener('mouseleave', handleTargetMouseLeave);
        };
    }, [clearCloseTimer, handleTargetMouseLeave, hoveredTextElement]);

    useEffect(() => {
        const lexicons = document.querySelectorAll('.lexicon');
        lexicons.forEach((lexicon) => {
            lexicon.classList.remove('underline');
        });

        if (hoveredTextElement) {
            hoveredTextElement.classList.add('underline');
        }
    }, [hoveredTextElement]);

    useEffect(() => {
        if (!hoveredText) {
            setMeaning(undefined);
            setUseAiFallback(false);
            return;
        }

        const activeHover = hoveredText;
        hoveredTextRef.current = activeHover;
        setUseAiFallback(false);

        const fetchMeaning = async () => {
            setIsLoading(true);
            try {
                const results = await getFreeDictionaryLexicons([activeHover]);
                if (activeHover !== hoveredTextRef.current) {
                    return;
                }
                const dictionaryResult = results?.[0]?.[0];
                if (dictionaryResult) {
                    setMeaning(dictionaryResult);
                } else {
                    setUseAiFallback(true);
                }
            } finally {
                if (activeHover === hoveredTextRef.current) {
                    setIsLoading(false);
                }
            }
        };

        fetchMeaning();
    }, [hoveredText]);

    useEffect(() => {
        if (!useAiFallback || !hoveredText) {
            return;
        }

        const aiDefinition = aiResults?.definitions?.[0];
        if (aiDefinition && hoveredText === hoveredTextRef.current) {
            setMeaning(aiDefinition);
        }
    }, [aiResults, hoveredText, useAiFallback]);

    const isContentLoading = isLoading || (useAiFallback && isAiLoading);
    const isAiMeaning = Boolean(meaning?.openai || useAiFallback);

    return (
        <Popover open={Boolean(hoveredTextElement)}>
            <PopoverContent
                anchor={hoveredTextElement}
                ref={popoverContentRef}
                className="w-80 p-4"
                side="top"
                align="start"
                initialFocus={false}
                onMouseEnter={clearCloseTimer}
                onMouseLeave={scheduleResetMenu}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        resetMenu();
                    }
                }}
            >
                {isContentLoading && (
                    <div className="space-y-2" role="status">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <p className="text-sm text-muted-foreground">Loading definition…</p>
                    </div>
                )}
                {hoveredText && !isContentLoading && meaning && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-base font-semibold">{meaning.word}</p>
                            <SourceBadge variant={isAiMeaning ? 'ai' : 'dictionary'} />
                        </div>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                            <span className="text-foreground">{meaning.meanings?.[0]?.partOfSpeech}</span>
                            {meaning.phonetics?.[0]?.text && (
                                <span className="font-mono">- {meaning.phonetics[0].text}</span>
                            )}
                            {meaning.phonetics?.[0] && (
                                <>
                                    <span>-</span>
                                    <Audio phonetic={meaning.phonetics[0]} showPhonetic={false} />
                                </>
                            )}
                        </div>
                        <p className="text-sm leading-relaxed">{meaning.meanings?.[0]?.definitions?.[0]?.definition}</p>
                        {isAiMeaning && (
                            <p className="flex items-center gap-1 text-xs text-status-ai-foreground">
                                <Sparkles className="size-3" />
                                AI fallback — verify before relying on it.
                            </p>
                        )}
                        <div className="flex justify-end pt-1">
                            <Link
                                href={`/search/${encodeURIComponent(meaning.word)}`}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                Go to this word
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                )}
                {hoveredText && !isContentLoading && !meaning && (
                    <p className="text-sm text-muted-foreground">No definition found for “{hoveredText}”</p>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default QuickMeaning;
