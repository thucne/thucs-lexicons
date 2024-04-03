import ResultPage from '@/components/organisms/ResultPage';
import { FREE_DICTIONARY_API } from '@/constants';
import { SearchResults } from '@/types';
import { searchWord } from '@/utils';
import type { Metadata } from 'next';

type WordPageProps = {
    params: { word: string };
};

export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
    const { word } = params;

    const result: SearchResults = await fetch(`${FREE_DICTIONARY_API}/${word}`).then((res) => res.json());

    // If the word is not found in the dictionary, the return message would be an object.
    // {
    //     "title": "No Definitions Found",
    //     "message": "Sorry pal, we couldn't find definitions for the word you were looking for.",
    //     "resolution": "You can try the search again at later time or head to the web instead."
    // }
    if (!Array.isArray(result)) {
        return {
            title: 'Lexicon not found',
            description: 'The lexicon could not be found in the dictionary.'
        };
    }

    const firstMeaning = result[0];
    const meaning = firstMeaning.meanings[0];
    const definition = meaning?.definitions?.[0]?.definition || '';

    return {
        title: `${word} | Definition in Free Dictionary API`,
        description: definition
    };
}

const WordPage = async ({ params }: WordPageProps) => {
    const { word } = params;
    const data = await searchWord(word);

    return <ResultPage word={word} results={data} />;
};

export default WordPage;
