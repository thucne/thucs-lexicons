import { FREE_DICTIONARY_API } from '@/constants';
import { License } from '@/types';

export const createUrl = (url: string, params: URLSearchParams): string => {
    return `${url}?${params.toString()}`;
};

export const getLicenseString = (license?: License): string =>
    license ? `${license.name} | ${license.url || 'No License URL found'}` : 'No License found';

export const searchWord = async (query: string) => {
    const res = await fetch(`${FREE_DICTIONARY_API}/${query}`);

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
};
