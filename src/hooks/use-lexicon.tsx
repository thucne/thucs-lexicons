import useSWR, { SWRConfiguration } from 'swr';

import { FREE_DICTIONARY_API } from '@/constants';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useLexicon = (word?: string, options?: SWRConfiguration) => {
    return useSWR(word ? `${FREE_DICTIONARY_API}/${word}` : null, fetcher, options);
};
