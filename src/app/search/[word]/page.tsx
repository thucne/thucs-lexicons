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
    if (!Array.isArray(results)) {
        return {
            title: 'Lexicon not found',
            description: 'The word could not be found in the dictionary.',
        };
    }

    const decodedWord = decodeURIComponent(word);

    return {
        title: `${decodedWord} | Definition in Free Dictionary API`,
        description: getFirstDefinition(results),
        openGraph: {
            images: [
                {
                    url: `/api/og?word=${word}&definition=${getFirstDefinition(results)}`,
                    width: 2400,
                    height: 1260
                }
            ]
        }
    };
}

const WordPage = async ({ params }: WordPageProps) => {
    const { word } = params;

    const { data } = await useSupabaseLexicon(word);

    const superbaseLexicon = data?.searchResults;

    return <ResultPage word={word} supabaseLexicon={superbaseLexicon} />;
};

export default WordPage;
