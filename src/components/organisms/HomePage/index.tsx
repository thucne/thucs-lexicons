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
        <PageShell className="py-8 md:py-14">
            <div className="rounded-2xl bg-muted/30 p-6 md:p-8">
                <div className="grid gap-8 md:grid-cols-12">
                    <div className="space-y-8 md:col-span-7">
                        <Badge variant="secondary" size="lg" className="gap-1.5 rounded-full">
                            <Search className="size-3.5" />
                            No account. No saved words. Just lookup.
                        </Badge>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-semibold tracking-tight leading-tight md:text-5xl">
                                A sharper way to explore English.
                            </h1>
                            <p className="max-w-lg text-lg text-muted-foreground">
                                Lexicons blends dictionary data with clearly labeled AI help for phrases, comparisons,
                                examples, and nuance.
                            </p>
                        </div>

                        <Suspense fallback={<Skeleton className="h-11 w-full" />}>
                            <SearchBar autoFocus size="large" onOpenCommand={openCommand} editable />
                        </Suspense>

                        <div className="flex flex-wrap gap-2">
                            {EXAMPLE_QUERIES.map((example) => (
                                <Link key={example} href={`/search/${encodeURIComponent(example)}`}>
                                    <Badge variant="chip" size="lg" className="cursor-pointer">
                                        {example}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-5">
                        <Card className="bg-background/80 shadow-sm">
                            <CardHeader>
                                <SectionHeading className="text-xl">Built for lookup flow</SectionHeading>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {capabilities.map((capability, index) => {
                                    const Icon = capability.icon;
                                    return (
                                        <div key={capability.title}>
                                            {index > 0 && <Separator className="mb-4" />}
                                            <div className="flex gap-3">
                                                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                                <div className="space-y-1">
                                                    <p className="font-medium">{capability.title}</p>
                                                    <p className="text-sm text-muted-foreground">{capability.body}</p>
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
