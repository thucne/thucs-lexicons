import { FREE_DICTIONARY_API } from "@/constants";

async function searchWord(query: string) {
    const res = await fetch(`${FREE_DICTIONARY_API}/${query}`);

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}

const WordPage = async ({ params }: { params: { word: string } }) => {
    try {
        const data = await searchWord(params.word);

        console.log(data);

        return <>Search page</>;
    } catch (error) {
        return <>This lexicon could not be found!</>
    }
};

export default WordPage;
