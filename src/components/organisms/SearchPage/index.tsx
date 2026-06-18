'use client';

import { Suspense } from 'react';

import SearchBar from '../NavigationBar/SearchBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type SearchPageProps = {
    word?: string;
};

const SearchPageBody = ({ word }: SearchPageProps) => {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 md:py-16">
            <Card>
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl">Search Lexicons</CardTitle>
                    <p className="text-muted-foreground">
                        Enter a word, phrase, idiom, or comparison to open the meaning explorer.
                    </p>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                        <SearchBar autoFocus defaultValue={word} size="large" />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
};

export default SearchPageBody;
