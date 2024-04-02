import ResultPage from '@/components/organisms/ResultPage';
import { FREE_DICTIONARY_API } from '@/constants';

async function searchWord(query: string) {
    const res = await fetch(`${FREE_DICTIONARY_API}/${query}`);

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

const WordPage = async ({ params }: { params: { word: string } }) => {
    const { word } = params;
    try {
        const data = await searchWord(word);
        return <ResultPage word={word} results={data} />;
    } catch (error) {
        return <p>This lexicon <b>&quot;{word}&quot;</b> could not be found!</p>;
    }
};

export default WordPage;
