import { beforeEach, describe, expect, it, vi } from 'vitest';

const createMock = vi.fn();

vi.mock('openai', () => ({
    default: vi.fn(function MockOpenAI() {
        return {
            chat: {
                completions: {
                    create: createMock
                }
            }
        };
    })
}));

describe('GET /api/openai/search/has-meaning', () => {
    beforeEach(() => {
        createMock.mockReset();
    });

    it('returns 400 for missing input', async () => {
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search/has-meaning'));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: 'Input parameter is required.' });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('returns 502 when OpenAI throws', async () => {
        vi.resetModules();
        createMock.mockRejectedValueOnce(new Error('OpenAI unavailable'));
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search/has-meaning?input=hello'));

        expect(response.status).toBe(502);
        await expect(response.json()).resolves.toEqual({ error: 'Failed to check definition.' });
    });

    it('returns 429 when the has-meaning route rate limit is exceeded', async () => {
        vi.resetModules();
        createMock.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ value: true }) } }]
        });
        const { GET } = await import('./route');
        const request = () =>
            new Request('http://localhost/api/openai/search/has-meaning?input=hello', {
                headers: { 'x-forwarded-for': '203.0.113.21' }
            });

        for (let index = 0; index < 10; index += 1) {
            await GET(request());
        }

        const response = await GET(request());

        expect(response.status).toBe(429);
        await expect(response.json()).resolves.toEqual({ error: 'Too many requests.' });
        expect(createMock).toHaveBeenCalledTimes(10);
    });

    it('returns parsed JSON for successful responses', async () => {
        vi.resetModules();
        const body = { value: true };
        createMock.mockResolvedValueOnce({
            choices: [{ message: { content: JSON.stringify(body) } }]
        });
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search/has-meaning?input=hello'));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual(body);
    });
});
