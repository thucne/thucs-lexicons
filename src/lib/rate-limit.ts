const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type Bucket = {
    count: number;
    resetAt: number;
};

const buckets = new Map<string, Bucket>();

const getClientIp = (request: Request) => {
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    return forwardedFor || request.headers.get('x-real-ip') || 'unknown';
};

export const resetRateLimitForTests = () => {
    buckets.clear();
};

export const rateLimitOrThrow = async (request: Request, key: string): Promise<Response | null> => {
    const now = Date.now();
    const clientKey = `${key}:${getClientIp(request)}`;
    const current = buckets.get(clientKey);
    const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + WINDOW_MS };

    if (bucket.count >= MAX_REQUESTS) {
        const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

        return Response.json(
            { error: 'Too many requests.' },
            {
                status: 429,
                headers: {
                    'Retry-After': String(retryAfterSeconds)
                }
            }
        );
    }

    bucket.count += 1;
    buckets.set(clientKey, bucket);

    return null;
};
