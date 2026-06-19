import { beforeEach, describe, expect, it } from 'vitest';

import { rateLimitOrThrow, resetRateLimitForTests } from '@/lib/rate-limit';

const requestForIp = (ip: string) =>
    new Request('http://localhost/api/openai/search?input=hello', {
        headers: {
            'x-forwarded-for': ip
        }
    });

describe('rateLimitOrThrow', () => {
    beforeEach(() => {
        resetRateLimitForTests();
    });

    it('allows requests under the per-IP limit', async () => {
        for (let index = 0; index < 10; index += 1) {
            await expect(rateLimitOrThrow(requestForIp('203.0.113.10'), 'openai-search')).resolves.toBeNull();
        }
    });

    it('returns 429 after the per-IP limit is exceeded', async () => {
        for (let index = 0; index < 10; index += 1) {
            await rateLimitOrThrow(requestForIp('203.0.113.11'), 'openai-search');
        }

        const response = await rateLimitOrThrow(requestForIp('203.0.113.11'), 'openai-search');

        expect(response?.status).toBe(429);
        expect(response?.headers.get('Retry-After')).toBe('60');
        await expect(response?.json()).resolves.toEqual({ error: 'Too many requests.' });
    });

    it('tracks separate IPs independently', async () => {
        for (let index = 0; index < 10; index += 1) {
            await rateLimitOrThrow(requestForIp('203.0.113.12'), 'openai-search');
        }

        await expect(rateLimitOrThrow(requestForIp('203.0.113.13'), 'openai-search')).resolves.toBeNull();
    });
});
