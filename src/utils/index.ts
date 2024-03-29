export const createUrl = (url: string, params: URLSearchParams): string => {
    return `${url}?${params.toString()}`;
};
