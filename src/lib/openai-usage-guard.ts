import type { SearchResults } from '@/types';

type AIResult = {
    definitions: SearchResults;
};

type DailyBudget = {
    count: number;
    resetAt: number;
};

type CachedResult = {
    result: AIResult;
    expiresAt: number;
};

const DEFAULT_DAILY_REQUEST_LIMIT = 100;
const DEFAULT_CACHE_TTL_SECONDS = 86_400;
const MS_PER_DAY = 86_400_000;

let dailyBudget: DailyBudget | undefined;
const cache = new Map<string, CachedResult>();

const parseNonNegativeInteger = (value: string | undefined, fallback: number) => {
    if (value === undefined) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const nextDailyReset = (now: number) => {
    const date = new Date(now);
    date.setUTCHours(24, 0, 0, 0);

    return date.getTime();
};

const getDailyLimit = () =>
    parseNonNegativeInteger(process.env.OPENAI_DAILY_REQUEST_LIMIT, DEFAULT_DAILY_REQUEST_LIMIT);

const getCacheTtlMs = () =>
    parseNonNegativeInteger(process.env.OPENAI_CACHE_TTL_SECONDS, DEFAULT_CACHE_TTL_SECONDS) * 1000;

const getCacheKey = (input: string) => input.trim().toLowerCase();

export const resetOpenAIUsageGuardForTests = () => {
    dailyBudget = undefined;
    cache.clear();
};

export const getCachedOpenAIResult = (input: string): AIResult | undefined => {
    const now = Date.now();
    const cached = cache.get(getCacheKey(input));

    if (!cached) {
        return undefined;
    }

    if (cached.expiresAt <= now) {
        cache.delete(getCacheKey(input));
        return undefined;
    }

    return cached.result;
};

export const setCachedOpenAIResult = (input: string, result: AIResult) => {
    const ttlMs = getCacheTtlMs();

    if (ttlMs <= 0) {
        return;
    }

    cache.set(getCacheKey(input), {
        result,
        expiresAt: Date.now() + ttlMs
    });
};

export const consumeOpenAIBudgetOrThrow = (): Response | null => {
    const limit = getDailyLimit();
    const now = Date.now();
    const current = dailyBudget && dailyBudget.resetAt > now ? dailyBudget : { count: 0, resetAt: nextDailyReset(now) };

    if (current.count >= limit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
        dailyBudget = current;

        return Response.json(
            { error: 'AI request budget reached.' },
            {
                status: 429,
                headers: {
                    'Retry-After': String(retryAfterSeconds)
                }
            }
        );
    }

    current.count += 1;
    dailyBudget = current;

    return null;
};
