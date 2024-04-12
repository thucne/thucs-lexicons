import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

import { FREE_DICTIONARY_API } from '@/constants';
import { SearchResults } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useLexicon = (
    word?: string,
    options?: SWRConfiguration
): SWRResponse & { data: SearchResults | undefined } => {
    return useSWR(word ? `${FREE_DICTIONARY_API}/${word}` : null, fetcher, options);
};
