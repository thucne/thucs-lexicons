import ResultPage from '@/components/organisms/ResultPage';
import { FREE_DICTIONARY_API } from '@/constants';
import { SearchResults } from '@/types';
import { createUrl, getFirstDefinition, searchWord } from '@/utils';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

type WordPageProps = {
    params: { word: string };
};

export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
    const { word } = params;

    const results: SearchResults = await fetch(`${FREE_DICTIONARY_API}/${word}`).then((res) => res.json());

    // If the word is not found in the dictionary, the return message would be an object.
    // {
    //     "title": "No Definitions Found",
    //     "message": "Sorry pal, we couldn't find definitions for the word you were looking for.",
    //     "resolution": "You can try the search again at later time or head to the web instead."
    // }
    if (!Array.isArray(results)) {
        return {
            title: 'Lexicon not found',
            description: 'The lexicon could not be found in the dictionary.'
        };
    }

    return {
        title: `${word} | Definition in Free Dictionary API`,
        description: getFirstDefinition(results)
    };
}

const WordPage = async ({ params }: WordPageProps) => {
    const { word } = params;
    try {
        const data = await searchWord(word);

        return <ResultPage word={word} results={data} />;
    } catch (error) {
        // redirect to the search page if the word is not found, maybe to suggest a similar word later.
        redirect(createUrl('/search', new URLSearchParams({ word })));
    }
};

export default WordPage;
