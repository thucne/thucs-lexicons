'use client';

import Link from 'next/link';
import { BookOpen, Compass, MessageSquare, Search } from 'lucide-react';
import { Suspense } from 'react';

import SearchBar from '../NavigationBar/SearchBar';
import { useCommandSearch } from '@/components/providers/command-search-provider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageShell } from '@/components/ui/page-shell';
import { SectionHeading } from '@/components/ui/section-heading';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { EXAMPLE_QUERIES } from '@/hooks/use-search-navigation';

const capabilities = [
    {
        icon: BookOpen,
        title: 'Dictionary First',
        body: 'Use canonical dictionary entries before any generated fallback.'
    },
    {
        icon: MessageSquare,
        title: 'Phrase Friendly',
        body: 'Search idioms, slang, comparisons, and multi-word expressions.'
    },
    {
        icon: Compass,
        title: 'Meaning Explorer',
        body: 'Move from a definition into examples, pronunciation, and related words.'
    }
];

const HomePage = () => {
    const { openCommand } = useCommandSearch();

    return (
        <PageShell className="py-5 sm:py-8 md:py-14">
            <div className="border-border/70 bg-muted/25 rounded-xl border p-4 sm:p-6 md:rounded-2xl md:p-8">
                <div className="grid gap-6 md:grid-cols-12 md:gap-8">
                    <div className="space-y-6 md:col-span-7 md:space-y-8">
                        <Badge
                            variant="secondary"
                            size="lg"
                            className="min-h-7 gap-1.5 rounded-full px-2.5 text-xs sm:text-sm"
                        >
                            <Search className="size-3.5" />
                            No account. No saved words. Just lookup.
                        </Badge>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                A sharper way to explore English.
                            </h1>
                            <p className="text-muted-foreground max-w-lg text-base leading-7 md:text-lg">
                                thucne dictionary blends dictionary data with clearly labeled AI help for phrases,
                                comparisons, examples, and nuance.
                            </p>
                        </div>

                        <Suspense fallback={<Skeleton className="h-11 w-full" />}>
                            <SearchBar autoFocus size="large" onOpenCommand={openCommand} editable />
                        </Suspense>

                        <div className="flex flex-wrap gap-2">
                            {EXAMPLE_QUERIES.map((example) => (
                                <Link key={example} href={`/search/${encodeURIComponent(example)}`}>
                                    <Badge
                                        variant="chip"
                                        size="lg"
                                        className="min-h-8 cursor-pointer px-3 text-xs sm:text-sm"
                                    >
                                        {example}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-5">
                        <Card size="sm" className="bg-background/80 shadow-sm">
                            <CardHeader className="pb-0">
                                <SectionHeading className="text-base sm:text-lg">Built for lookup flow</SectionHeading>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {capabilities.map((capability, index) => {
                                    const Icon = capability.icon;
                                    return (
                                        <div key={capability.title}>
                                            {index > 0 && <Separator className="mb-4" />}
                                            <div className="flex gap-3">
                                                <Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                                                <div className="space-y-1">
                                                    <p className="font-medium">{capability.title}</p>
                                                    <p className="text-muted-foreground text-sm">{capability.body}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageShell>
    );
};

export default HomePage;
