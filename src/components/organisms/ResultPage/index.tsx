'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SearchCheck, Sparkles, X } from 'lucide-react';

import MeaningComponent from '@/components/molecules/Meaning';
import PronunciationList from '@/components/molecules/PronunciationList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PageShell } from '@/components/ui/page-shell';
import { Separator } from '@/components/ui/separator';
import { SourceBadge } from '@/components/ui/source-badge';
import { useLexicon, useLexiconWithAI } from '@/hooks/use-lexicon';
import { selectSearchResults, setSearchResults } from '@/redux/reducers/searchResults';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Meaning, SearchResult, SearchResults } from '@/types';
import { HERO_MAX_PRONUNCIATION_VARIANTS } from '@/utils/phonetics';
import { extractCoreWord } from '@/utils';

import QuickMeaning from './QuickMeaning';
import { getResultDisplayState, isSearchResults, pickSearchResults } from './result-selection';
import { ResultEmptyState, ResultLoadingState } from './result-states';
import { ResultSidebar } from './result-sidebar';

type ResultPageProps = {
    word: string;
    mode?: string;
};

const getPartOfSpeechList = (entry: SearchResult) =>
    Array.from(new Set(entry.meanings.map((meaning) => meaning.partOfSpeech).filter(Boolean)));

const shouldUseAIFirst = (query: string) =>
    query.trim().includes(' ') || /\bvs\.?\b/i.test(query) || /\bin a sentence\b/i.test(query);

const ResultHero = ({
    word,
    entry,
    isByAI,
    mode
}: {
    word: string;
    entry: SearchResult;
    isByAI: boolean;
    mode?: string;
}) => {
    const partOfSpeechList = getPartOfSpeechList(entry);
    const { displayWord, searchedWord, correctionWord } = getResultDisplayState(word, entry);

    const cleanDisplayWord = extractCoreWord(displayWord);

    const activeMode =
        mode ||
        (/\bvs\s+(?:a\s+)?similar\s+word$/i.test(word) || /\bvs\b/i.test(displayWord)
            ? 'similar'
            : /\bin\s+a\s+sentence$/i.test(word) || /\bin a sentence$/i.test(displayWord)
              ? 'context'
              : /^common\s+phrases\s+with\b/i.test(word) || /^common phrases with\b/i.test(displayWord)
                ? 'phrase'
                : undefined);

    return (
        <header className="space-y-4 border-b pb-5 sm:pb-6">
            <div className="flex flex-wrap items-center gap-2">
                <SourceBadge variant={isByAI ? 'ai' : 'dictionary'} />
                {activeMode && (
                    <Link href={`/search/${encodeURIComponent(cleanDisplayWord)}`}>
                        <Badge
                            className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 flex cursor-pointer items-center gap-1 rounded-full border pr-2 text-xs font-medium uppercase tracking-wide transition-colors duration-200"
                            title="Remove mode"
                        >
                            {activeMode === 'similar' && 'Compare Mode'}
                            {activeMode === 'context' && 'Sentence Mode'}
                            {activeMode === 'phrase' && 'Phrase Mode'}
                            <X className="hover:text-primary/70 size-3 transition-colors" />
                        </Badge>
                    </Link>
                )}
                {partOfSpeechList.map((pos) => (
                    <Badge
                        key={pos}
                        variant="secondary"
                        className="rounded-full text-xs font-medium uppercase tracking-wide"
                    >
                        {pos}
                    </Badge>
                ))}
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                    {cleanDisplayWord}
                </h1>
                <PronunciationList entry={entry} maxVariants={HERO_MAX_PRONUNCIATION_VARIANTS} />
            </div>

            {correctionWord && (
                <Alert className="border-primary/30 bg-primary/5">
                    <SearchCheck className="text-primary size-4" />
                    <AlertDescription>
                        Showing results for{' '}
                        <Link
                            href={`/search/${encodeURIComponent(correctionWord)}`}
                            className="font-medium underline underline-offset-4"
                        >
                            {correctionWord}
                        </Link>
                        . You searched for “{searchedWord}”.
                    </AlertDescription>
                </Alert>
            )}

            {isByAI && (
                <Alert className="border-status-ai/40 bg-status-ai/30">
                    <Sparkles className="text-status-ai-foreground size-4" />
                    <AlertDescription className="text-status-ai-foreground">
                        AI generated this entry because the dictionary source did not cover the query. Check wording
                        before relying on it.
                    </AlertDescription>
                </Alert>
            )}
        </header>
    );
};

const ResultDefinitions = ({ entry, word }: { entry: SearchResult; word: string }) => {
    const posGroups = entry.meanings.reduce<Record<string, Meaning[]>>((acc, meaning) => {
        const key = meaning.partOfSpeech || 'Other';
        acc[key] = acc[key] ? [...acc[key], meaning] : [meaning];
        return acc;
    }, {});

    const posEntries = Object.entries(posGroups);

    if (posEntries.length === 1) {
        const [, meanings] = posEntries[0];
        return (
            <div className="max-w-prose space-y-6">
                {meanings.map((meaning, index) => (
                    <MeaningComponent
                        key={`${word}-${meaning.partOfSpeech}-${index}`}
                        meaning={meaning}
                        index={index}
                    />
                ))}
            </div>
        );
    }

    return (
        <Accordion multiple defaultValue={posEntries.map(([pos]) => pos)} className="max-w-prose">
            {posEntries.map(([pos, meanings]) => (
                <AccordionItem key={pos} value={pos}>
                    <AccordionTrigger className="text-muted-foreground text-xs font-medium uppercase tracking-wide hover:no-underline">
                        {pos}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-2">
                        {meanings.map((meaning, index) => (
                            <MeaningComponent
                                key={`${word}-${pos}-${index}`}
                                meaning={meaning}
                                index={index}
                                hidePosLabel
                            />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

const mergePhonetics = (
    aiResults: SearchResults | undefined,
    dictResults: SearchResults | undefined
): SearchResults | undefined => {
    if (!aiResults?.length || !dictResults?.length) {
        return aiResults;
    }

    const dictEntry = dictResults[0];
    if (!dictEntry) {
        return aiResults;
    }

    return aiResults.map((aiEntry, idx) => {
        if (idx === 0 && aiEntry.word.toLowerCase() === dictEntry.word.toLowerCase()) {
            return {
                ...aiEntry,
                phonetic: dictEntry.phonetic || aiEntry.phonetic,
                phonetics: dictEntry.phonetics?.length ? dictEntry.phonetics : aiEntry.phonetics
            };
        }
        return aiEntry;
    });
};

const ResultPage = ({ word: rawWord, mode }: ResultPageProps) => {
    const word = decodeURIComponent(rawWord);
    const dispatch = useAppDispatch();
    const searchResultsFromStore = useAppSelector(selectSearchResults);
    const cacheKey = mode ? `${word}?mode=${mode}` : word;
    const resultsFromStore =
        searchResultsFromStore.word.toLowerCase() === cacheKey.toLowerCase()
            ? searchResultsFromStore.results
            : undefined;

    const shouldFetchDictionary = !resultsFromStore?.length && !shouldUseAIFirst(word) && !mode;
    const { data: resultsFromFetchRaw, isLoading } = useLexicon(shouldFetchDictionary ? word : undefined);
    const resultsFromFetch = isSearchResults(resultsFromFetchRaw) ? resultsFromFetchRaw : undefined;
    const shouldFetchWithAI = !resultsFromStore?.length && !isLoading && !resultsFromFetch?.length;
    const { data: resultsFromAIRaw, isLoading: isAILoading } = useLexiconWithAI(
        shouldFetchWithAI ? word : undefined,
        mode
    );
    const resultsFromAI = isSearchResults(resultsFromAIRaw?.definitions) ? resultsFromAIRaw.definitions : undefined;

    const shouldFetchDictPhonetics = !resultsFromStore?.length && Boolean(mode);
    const { data: dictPhoneticsRaw } = useLexicon(shouldFetchDictPhonetics ? word : undefined);
    const dictPhonetics = isSearchResults(dictPhoneticsRaw) ? dictPhoneticsRaw : undefined;

    const finalizedAIResults = resultsFromAI ? mergePhonetics(resultsFromAI, dictPhonetics) : undefined;

    const results = pickSearchResults({
        store: resultsFromStore,
        storeWord: searchResultsFromStore.word,
        query: cacheKey,
        fetch: resultsFromFetch,
        ai: finalizedAIResults
    });

    useEffect(() => {
        const nextResults = resultsFromFetch || finalizedAIResults;

        if (nextResults?.length) {
            dispatch(setSearchResults({ word: cacheKey, results: nextResults }));
        }
    }, [dispatch, finalizedAIResults, resultsFromFetch, cacheKey]);

    if (isLoading || isAILoading) {
        return <ResultLoadingState word={word} />;
    }

    if (!results?.length) {
        return <ResultEmptyState word={word} />;
    }

    const primaryEntry = results[0];
    const isByAI = Boolean(resultsFromAI?.length || results.some((result) => result.openai));

    return (
        <PageShell className="py-5 sm:py-8 md:py-10">
            <QuickMeaning />
            <div className="grid gap-7 md:grid-cols-12 md:gap-8">
                <div className="space-y-7 md:col-span-8 md:space-y-8">
                    <ResultHero word={word} entry={primaryEntry} isByAI={isByAI} mode={mode} />
                    {mode === 'similar' && results.length >= 2 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {results.slice(0, 2).map((result, index) => (
                                <div
                                    key={`${word}-compare-${index}`}
                                    className="border-border/80 bg-card text-card-foreground shadow-xs flex flex-col gap-4 rounded-lg border p-5"
                                >
                                    <h2 className="text-primary border-b pb-2 text-xl font-bold capitalize">
                                        {result.word}
                                    </h2>
                                    <ResultDefinitions entry={result} word={word} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        results.map((result, index) => (
                            <div key={`${word}-result-${index}`}>
                                {index > 0 && (
                                    <>
                                        <Separator className="mb-6" />
                                        <h2 className="mb-4 text-2xl font-semibold tracking-tight">{result.word}</h2>
                                    </>
                                )}
                                <ResultDefinitions entry={result} word={word} />
                            </div>
                        ))
                    )}
                </div>
                <aside className="md:col-span-4">
                    <div className="md:sticky md:top-16">
                        <ResultSidebar word={word} entry={primaryEntry} results={results} />
                    </div>
                </aside>
            </div>
        </PageShell>
    );
};

export default ResultPage;
