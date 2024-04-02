import { License } from "@/types";

export const createUrl = (url: string, params: URLSearchParams): string => {
    return `${url}?${params.toString()}`;
};

export const getLicenseString = (license?: License): string => license ? `${license.name} | ${license.url || 'No License URL found'}` : "No License found";