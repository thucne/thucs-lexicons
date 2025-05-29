import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

import { FREE_DICTIONARY_API, OPENAI_MEANING_API, OPENAI_MEANING_CHECK_API } from '@/constants';
import { SearchResults } from '@/types';

type OpenAIResults = {
    definitions: SearchResults;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;
export const useLexicon = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: SearchResults | undefined } => {
    return useSWR(word ? `${FREE_DICTIONARY_API}/${word}` : null, fetcher, options);
};

export const useLexiconWithAI = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: OpenAIResults | undefined } => {
    return useSWR(word ? `${DOMAIN}${OPENAI_MEANING_API}?input=${word.slice(0, 100)}` : null, fetcher, options);
};

export const useLexiconWithAICheck = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: { value: boolean } | undefined } => {
    return useSWR(
        word ? `${DOMAIN}${OPENAI_MEANING_CHECK_API}?input=${word.slice(0, 100)}` : null,
        (url) => fetch(url).then((res) => res.json()),
        options
    );
}