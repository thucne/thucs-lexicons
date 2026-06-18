import ResultPage from '@/components/organisms/ResultPage';
import { FREE_DICTIONARY_API } from '@/constants';
import { SearchResults } from '@/types';
import { getFirstDefinition } from '@/utils';
import type { Metadata } from 'next';

type WordPageProps = {
    params: Promise<{ word: string }>;
};

export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
    const { word } = await params;
    const decodedWord = decodeURIComponent(word);

    const results: SearchResults | unknown = await fetch(`${FREE_DICTIONARY_API}/${encodeURIComponent(decodedWord)}`)
        .then((res) => res.json())
        .catch(() => undefined);

    const hasDictionaryResult = Array.isArray(results);

    return {
        title: `${decodedWord} | Meaning Explorer - Lexicons`,
        description: hasDictionaryResult
            ? getFirstDefinition(results)
            : `Explore meanings, phrases, examples, and related words for "${decodedWord}".`,
        openGraph: {
            images: [
                {
                    url: `/api/og?word=${word}&definition=${
                        hasDictionaryResult
                            ? encodeURIComponent(getFirstDefinition(results))
                            : 'Open Lexicons to explore this entry'
                    }`,
                    width: 1200,
                    height: 630
                }
            ]
        }
    };
}

const WordPage = async ({ params }: WordPageProps) => {
    const { word } = await params;

    return <ResultPage word={word} />;
};

export default WordPage;
