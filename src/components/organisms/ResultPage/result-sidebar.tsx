import Link from 'next/link';
import { GitCompare, Lightbulb, Mic, Sparkles } from 'lucide-react';

import PronunciationList from '@/components/molecules/PronunciationList';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { SearchResult, SearchResults } from '@/types';
import { cn } from '@/lib/utils';
import { getUniquePhonetics, hasPronunciation, HERO_MAX_PRONUNCIATION_VARIANTS } from '@/utils/phonetics';
import { extractCoreWord } from '@/utils';

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean))).slice(0, 12);

const getRelatedWords = (results: SearchResults, field: 'synonyms' | 'antonyms') => {
    return unique(
        results.flatMap((result) =>
            result.meanings.flatMap((meaning) => [
                ...(meaning[field] || []),
                ...meaning.definitions.flatMap((definition) => definition[field] || [])
            ])
        )
    );
};

const getExampleSentences = (results: SearchResults) => {
    return results
        .flatMap((result) => result.meanings)
        .flatMap((meaning) => meaning.definitions)
        .map((definition) => definition.example)
        .filter((example): example is string => Boolean(example))
        .slice(0, 4);
};

export function PronunciationCard({ entry }: { entry: SearchResult }) {
    const uniqueCount = getUniquePhonetics(entry).length;
    const overflowCount = uniqueCount - HERO_MAX_PRONUNCIATION_VARIANTS;

    if (!hasPronunciation(entry) || overflowCount <= 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <SectionHeading className="flex items-center gap-2">
                    <Mic className="size-4" />
                    More pronunciations
                </SectionHeading>
            </CardHeader>
            <CardContent>
                <PronunciationList entry={entry} offset={HERO_MAX_PRONUNCIATION_VARIANTS} className="sm:flex-col" />
            </CardContent>
        </Card>
    );
}

export function ExploreWithAICard({ word }: { word: string }) {
    const coreWord = extractCoreWord(word);
    const prompts = [
        {
            icon: Lightbulb,
            label: 'Context Mode',
            href: `/search/${encodeURIComponent(coreWord)}?mode=context`
        },
        {
            icon: GitCompare,
            label: 'Compare Mode',
            href: `/search/${encodeURIComponent(coreWord)}?mode=similar`
        },
        {
            icon: Sparkles,
            label: 'Phrase Mode',
            href: `/search/${encodeURIComponent(coreWord)}?mode=phrase`
        }
    ];

    return (
        <Card>
            <CardHeader>
                <SectionHeading>Explore with AI</SectionHeading>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">
                    These searches use generated help only when the dictionary cannot cover the request directly.
                </p>
                <div className="flex flex-wrap gap-2">
                    {prompts.map((prompt) => {
                        const Icon = prompt.icon;
                        return (
                            <Link
                                key={prompt.label}
                                href={prompt.href}
                                className={cn(
                                    buttonVariants({ variant: 'outline', size: 'sm' }),
                                    'gap-1.5 rounded-full'
                                )}
                            >
                                <Icon className="size-3.5" />
                                {prompt.label}
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export function RelatedMapCard({ results }: { results: SearchResults }) {
    const synonyms = getRelatedWords(results, 'synonyms');
    const antonyms = getRelatedWords(results, 'antonyms');

    if (!synonyms.length && !antonyms.length) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <SectionHeading>Related Map</SectionHeading>
            </CardHeader>
            <CardContent className="space-y-4">
                {[
                    ['Synonyms', synonyms],
                    ['Antonyms', antonyms]
                ].map(([label, words]) =>
                    Array.isArray(words) && words.length ? (
                        <div key={label as string} className="space-y-2">
                            <p className="text-sm font-medium">{label as string}</p>
                            <div className="flex flex-wrap gap-2">
                                {words.map((relatedWord) => (
                                    <Link
                                        key={relatedWord}
                                        href={`/search/${encodeURIComponent(relatedWord)}`}
                                        className={cn(
                                            buttonVariants({ variant: 'outline', size: 'sm' }),
                                            'rounded-full'
                                        )}
                                    >
                                        {relatedWord}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : null
                )}
            </CardContent>
        </Card>
    );
}

export function ExampleLabCard({ results }: { results: SearchResults }) {
    const examples = getExampleSentences(results);

    if (!examples.length) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <SectionHeading>Example Lab</SectionHeading>
            </CardHeader>
            <CardContent className="space-y-2">
                {examples.map((example, index) => (
                    <p
                        key={`${example}-${index}`}
                        className="border-border text-muted-foreground border-l-2 pl-3 text-sm"
                    >
                        {example}
                    </p>
                ))}
            </CardContent>
        </Card>
    );
}

export function ResultSidebar({ word, entry, results }: { word: string; entry: SearchResult; results: SearchResults }) {
    return (
        <div className="space-y-4">
            <PronunciationCard entry={entry} />
            <ExploreWithAICard word={word} />
            <RelatedMapCard results={results} />
            <ExampleLabCard results={results} />
        </div>
    );
}
