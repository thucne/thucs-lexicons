import ResultPage from '@/components/organisms/ResultPage';
import { FREE_DICTIONARY_API } from '@/constants';
import { useSupabaseLexicon } from '@/hooks/use-supabase';
import { SearchResults } from '@/types';
import { getFirstDefinition } from '@/utils';
import type { Metadata } from 'next';

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

    const { data } = await useSupabaseLexicon(word);

    const superbaseLexicon = data?.searchResults;

    return <ResultPage word={word} supabaseLexicon={superbaseLexicon} />;
};

export default WordPage;
