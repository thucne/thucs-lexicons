import Link from 'next/link';

import { KbdHint } from '@/components/ui/kbd-hint';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PageShell } from '@/components/ui/page-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EXAMPLE_QUERIES } from '@/hooks/use-search-navigation';

import QuickMeaning from './QuickMeaning';

export function ResultLoadingState({ word }: { word: string }) {
    return (
        <PageShell className="py-5 sm:py-8 md:py-10" role="status" aria-live="polite">
            <QuickMeaning />
            <div className="grid gap-7 md:grid-cols-12 md:gap-8">
                <div className="space-y-7 md:col-span-8 md:space-y-8">
                    <header className="space-y-4 border-b pb-5 sm:pb-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <Skeleton className="h-5 w-24 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                {word}
                            </h1>
                            <Skeleton className="h-6 w-32" />
                        </div>
                    </header>

                    <div className="max-w-prose space-y-6">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm">
                        Exploring <span className="text-foreground font-medium">{word}</span>…
                    </p>
                </div>

                <aside className="md:col-span-4">
                    <div className="space-y-4 md:sticky md:top-16">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                    <Skeleton className="h-8 w-28 rounded-full" />
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-24" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton className="h-8 w-20 rounded-full" />
                                        <Skeleton className="h-8 w-24 rounded-full" />
                                        <Skeleton className="h-8 w-16 rounded-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </aside>
            </div>
        </PageShell>
    );
}

export function ResultEmptyState({ word }: { word: string }) {
    const examples = EXAMPLE_QUERIES.slice(0, 2);

    return (
        <PageShell size="narrow" className="py-5 sm:py-8 md:py-14">
            <div className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">No meaning found</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        We could not find a dictionary or AI match for this query.
                    </p>
                </div>
                <Alert>
                    <AlertTitle>No dictionary or AI match</AlertTitle>
                    <AlertDescription>
                        “{word}” did not return a dictionary entry or a confident AI fallback. Try a shorter phrase,
                        different spelling, or one of the examples below.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-wrap items-center gap-2">
                    {examples.map((example) => (
                        <Link key={example} href={`/search/${encodeURIComponent(example)}`}>
                            <Badge variant="chip" size="lg" className="min-h-8 cursor-pointer px-3 text-xs sm:text-sm">
                                {example}
                            </Badge>
                        </Link>
                    ))}
                    <Link href={`/search/${encodeURIComponent(`${word} vs similar word`)}`}>
                        <Badge variant="chip" size="lg" className="min-h-8 cursor-pointer px-3 text-xs sm:text-sm">
                            Try Compare Mode
                        </Badge>
                    </Link>
                </div>
                <p className="text-muted-foreground text-sm">
                    Or press <KbdHint className="inline-flex" /> to search from anywhere.
                </p>
            </div>
        </PageShell>
    );
}
