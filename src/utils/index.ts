import { FREE_DICTIONARY_API } from '@/constants';
import { License, SearchResults } from '@/types';

export const createUrl = (url: string, params: URLSearchParams): string => {
    return `${url}?${params.toString()}`;
};

export const getLicenseString = (license?: License): string =>
    license ? `${license.name} | ${license.url || 'No License URL found'}` : 'No License found';

export const searchWord = async (query?: string) => {
    if (!query) {
        return [];
    }

    const res = await fetch(`${FREE_DICTIONARY_API}/${query}`);

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
};

export const isFavorite = (word: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(word);
};

export const toggleFavorites = (word: string) => {
    let nextState;

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(word)) {
        favorites.splice(favorites.indexOf(word), 1);
        nextState = false;
    } else {
        favorites.push(word);
        nextState = true;
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    return nextState;
};

export const getFavorites = () => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
};

export const getFirstDefinition = (results: SearchResults) => {
    const firstMeaning = results[0];
    const meaning = firstMeaning.meanings[0];
    const definition = meaning?.definitions?.[0]?.definition || '';
    return definition;
};
