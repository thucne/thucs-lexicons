import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

import { FREE_DICTIONARY_API, OPENAI_MEANING_API, OPENAI_MEANING_CHECK_API } from '@/constants';
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

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || '';
export const useLexicon = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: SearchResults | undefined } => {
    return useSWR<SearchResults>(word ? `${FREE_DICTIONARY_API}/${encodeURIComponent(word)}` : null, jsonFetcher, options);
};

export const useLexiconWithAI = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: OpenAIResults | undefined } => {
    return useSWR<OpenAIResults>(
        word ? `${DOMAIN}${OPENAI_MEANING_API}?input=${encodeURIComponent(word.slice(0, 100))}` : null,
        jsonFetcher,
        options
    );
};

export const useLexiconWithAICheck = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: { value: boolean } | undefined } => {
    return useSWR<{ value: boolean }>(
        word ? `${DOMAIN}${OPENAI_MEANING_CHECK_API}?input=${encodeURIComponent(word.slice(0, 100))}` : null,
        jsonFetcher,
        options
    );
};
