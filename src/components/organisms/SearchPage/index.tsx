'use client';
import { redirect } from 'next/navigation';

import { useLexicon } from '@/hooks/use-lexicon';

type SearchPageProps = {
    word: string;
};

const SearchPageBody = ({ word }: SearchPageProps) => {
    const { data, error, isLoading } = useLexicon(word);

    if (isLoading) {
        return <div>Fetching data...</div>;
    }

    if (error) {
        throw new Error('Failed to fetch data');
    }

    if (!Array.isArray(data)) {
        return (
            <div>
                Lexicon <b>&quot;{word}&quot;</b> not found!
            </div>
        );
    }

    redirect(`/search/${word}`);
};

export default SearchPageBody;
