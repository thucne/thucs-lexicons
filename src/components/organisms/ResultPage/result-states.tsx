import Link from 'next/link';

import { KbdHint } from '@/components/ui/kbd-hint';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PageShell } from '@/components/ui/page-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { EXAMPLE_QUERIES } from '@/hooks/use-search-navigation';

export function ResultLoadingState({ word }: { word: string }) {
    return (
        <PageShell size="narrow" role="status" aria-live="polite">
            <div className="space-y-6">
                <div className="space-y-3 border-b pb-6">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-12 w-2/3" />
                    <Skeleton className="h-5 w-40" />
                </div>
                <div className="max-w-prose space-y-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="hidden space-y-3 md:block">
                    <Skeleton className="h-24 w-full max-w-sm" />
                    <Skeleton className="h-24 w-full max-w-sm" />
                </div>
                <p className="text-muted-foreground text-sm">
                    Exploring <span className="text-foreground font-medium">{word}</span>…
                </p>
            </div>
        </PageShell>
    );
}

export function ResultEmptyState({ word }: { word: string }) {
    const examples = EXAMPLE_QUERIES.slice(0, 2);

    return (
        <PageShell size="narrow">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">No meaning found</h1>
                    <p className="text-muted-foreground">We could not find a dictionary or AI match for this query.</p>
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
                            <Badge variant="chip" size="lg" className="cursor-pointer">
                                {example}
                            </Badge>
                        </Link>
                    ))}
                    <Link href={`/search/${encodeURIComponent(`${word} vs similar word`)}`}>
                        <Badge variant="chip" size="lg" className="cursor-pointer">
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
