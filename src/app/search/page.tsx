import SearchPageBody from '@/components/organisms/SearchPage';
import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

type SearchPageProps = {
    searchParams: Promise<{ word?: string }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const { word } = await searchParams;

    if (!word) {
        return {
            title: 'Search',
            description: 'Search for a word in the dictionary.'
        };
    }

    return {
        title: `Searching "${word}" | Lexicons`,
        description: `Opening the meaning explorer for "${word}".`
    };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const { word: rawWord } = await searchParams;
    const word = rawWord?.trim();

    if (word) {
        permanentRedirect(`/search/${encodeURIComponent(word)}`);
    }

    return <SearchPageBody word={word} />;
};

export default SearchPage;
