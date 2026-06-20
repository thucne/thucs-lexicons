import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

import { FREE_DICTIONARY_API, OPENAI_MEANING_API } from '@/constants';
import { SearchResults } from '@/types';

type OpenAIResults = {
    definitions: SearchResults;
};

export async function jsonFetcher<T>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed: ${res.status}`);
    }

    return res.json();
}

export const useLexicon = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: SearchResults | undefined } => {
    return useSWR<SearchResults>(
        word ? `${FREE_DICTIONARY_API}/${encodeURIComponent(word)}` : null,
        jsonFetcher,
        options
    );
};

export const useLexiconWithAI = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: OpenAIResults | undefined } => {
    return useSWR<OpenAIResults>(
        word ? `${OPENAI_MEANING_API}?input=${encodeURIComponent(word.slice(0, 100))}` : null,
        jsonFetcher,
        options
    );
};
