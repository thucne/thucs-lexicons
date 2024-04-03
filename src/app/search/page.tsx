import React from 'react';
import SearchPageBody from '@/components/organisms/SearchPage';
import type { Metadata } from 'next';
import { searchWord } from '@/utils';
import { redirect } from 'next/navigation';

type SearchPageProps = {
    searchParams: { word: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const { word } = searchParams;

    try {
        const result = await searchWord(word);

        if (!Array.isArray(result)) {
            throw new Error('Failed to fetch data');
        }

        redirect(`/search/${word}`);
    } catch (error) {
        return {
            title: `"${word}" | Not Found`,
            description: `The lexicon "${word}" could not be found in the dictionary.`
        };
    }
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
    const { word } = searchParams;
    return <SearchPageBody word={word} />;
};

export default SearchPage;
