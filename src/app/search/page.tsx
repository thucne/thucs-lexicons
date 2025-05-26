import React from 'react';
import SearchPageBody from '@/components/organisms/SearchPage';
import type { Metadata } from 'next';
import { searchWord } from '@/utils';
import { permanentRedirect } from 'next/navigation';

type SearchPageProps = {
    searchParams: { word: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const { word } = searchParams;

    if (!word) {
        return {
            title: 'Search',
            description: 'Search for a word in the dictionary.'
        };
    }

    try {
        const result = await searchWord(word);

        if (!Array.isArray(result)) {
            throw new Error('Failed to fetch data');
        }

        return {
            title: 'Redirecting...',
            description: 'Redirecting to the word page...'
        };
    } catch (_) {
        return {
            title: `"${word}" | Not Found`,
            description: `The word "${word}" could not be found in the dictionary.`
        };
    }
}

async function shouldRedirect(word: string): Promise<boolean> {
    if (!word) {
        return false;
    }

    try {
        const result = await searchWord(word);

        if (!Array.isArray(result)) {
            return true;
        }

        return false;
    } catch (_) {
        return false;
    }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const { word } = searchParams;

    const shouldRedirectToLexiconPage = await shouldRedirect(word);

    if (shouldRedirectToLexiconPage) {
        permanentRedirect(`/search/${word}`);
    }

    return <SearchPageBody word={word} />;
};

export default SearchPage;
