import ResultPage from '@/components/organisms/ResultPage';
import { FREE_DICTIONARY_API, OPENAI_MEANING_CHECK_API } from '@/constants';
import { useSupabaseLexicon } from '@/hooks/use-supabase';
import { SearchResults } from '@/types';
import { getFirstDefinition } from '@/utils';
import type { Metadata } from 'next';

type WordPageProps = {
    params: { word: string };
};

type HasMeaningCheck = {
    value: boolean;
};

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
    const { word } = params;

    let results: SearchResults | boolean = await fetch(`${FREE_DICTIONARY_API}/${word}`).then((res) => res.json());

    // If the word is not found in the dictionary, the return message would be an object.
    if (!Array.isArray(results)) {
        // retry with openAI search
        const openAIResults: HasMeaningCheck = await fetch(
            `${DOMAIN}${OPENAI_MEANING_CHECK_API}?input=${word.slice(0, 100)}`
        ).then((res) => res.json());

        if (!openAIResults?.value) {
            return {
                title: `Definition of "${decodeURIComponent(word)}" | thucne dictionary`,
                description: 'The searched term could not be found. Sorry!'
            };
        }

        results = true;
    }

    const decodedWord = decodeURIComponent(word);

    return {
        title: `${decodedWord} | Definition in Free Dictionary API`,
        description: results === true ? 'Definitions in thucne dictionary' : getFirstDefinition(results),
        openGraph: {
            images: [
                {
                    url: `/api/og?word=${word}&definition=${
                        results === true ? 'Click to see definition!' : encodeURIComponent(getFirstDefinition(results))
                    }`,
                    width: 1200,
                    height: 630
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
