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

describe('GET /api/openai/search', () => {
    beforeEach(() => {
        process.env.OPENAI_API_KEY = 'test-openai-key';
        delete process.env.OPENAI_DAILY_REQUEST_LIMIT;
        delete process.env.OPENAI_CACHE_TTL_SECONDS;
        createMock.mockReset();
        vi.resetModules();
    });

    it('returns 400 for missing input', async () => {
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search'));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: 'Input parameter is required.' });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('returns 502 when OpenAI throws', async () => {
        createMock.mockRejectedValueOnce(new Error('OpenAI unavailable'));
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=hello'));

        expect(response.status).toBe(502);
        await expect(response.json()).resolves.toEqual({ error: 'Failed to fetch definition.' });
    });

    it('returns 503 when OpenAI is not configured', async () => {
        delete process.env.OPENAI_API_KEY;
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=hello'));

        expect(response.status).toBe(503);
        await expect(response.json()).resolves.toEqual({ error: 'AI search is not configured.' });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('returns a local fallback for promoted example queries without calling OpenAI', async () => {
        delete process.env.OPENAI_API_KEY;
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=affect%20vs%20effect'));

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.definitions[0]).toMatchObject({
            openai: true,
            word: 'affect vs effect'
        });
        expect(body.definitions[0].meanings[0].definitions[0].definition).toContain('Affect is usually a verb');
        expect(createMock).not.toHaveBeenCalled();
    });

    it('returns 429 when the search route rate limit is exceeded', async () => {
        process.env.OPENAI_CACHE_TTL_SECONDS = '0';
        createMock.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ definitions: [] }) } }]
        });
        const { GET } = await import('./route');
        const request = () =>
            new Request('http://localhost/api/openai/search?input=hello', {
                headers: { 'x-forwarded-for': '203.0.113.20' }
            });

        for (let index = 0; index < 10; index += 1) {
            await GET(request());
        }

        const response = await GET(request());

        expect(response.status).toBe(429);
        await expect(response.json()).resolves.toEqual({ error: 'Too many requests.' });
        expect(createMock).toHaveBeenCalledTimes(10);
    });

    it('returns 429 when the daily OpenAI request budget is exhausted', async () => {
        process.env.OPENAI_DAILY_REQUEST_LIMIT = '1';
        process.env.OPENAI_CACHE_TTL_SECONDS = '0';
        createMock.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ definitions: [] }) } }]
        });
        const { GET } = await import('./route');

        const firstResponse = await GET(new Request('http://localhost/api/openai/search?input=hello'));
        const secondResponse = await GET(new Request('http://localhost/api/openai/search?input=world'));

        expect(firstResponse.status).toBe(200);
        expect(secondResponse.status).toBe(429);
        await expect(secondResponse.json()).resolves.toEqual({ error: 'AI request budget reached.' });
        expect(secondResponse.headers.get('Retry-After')).toBeTruthy();
        expect(createMock).toHaveBeenCalledTimes(1);
    });

    it('does not spend daily budget on local fallbacks', async () => {
        process.env.OPENAI_DAILY_REQUEST_LIMIT = '0';
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=affect%20vs%20effect'));

        expect(response.status).toBe(200);
        expect(createMock).not.toHaveBeenCalled();
    });

    it('serves repeated AI fallback queries from cache without extra OpenAI calls', async () => {
        const body = { definitions: [{ openai: true, word: 'hello' }] };
        createMock.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(body) } }]
        });
        const { GET } = await import('./route');

        const firstResponse = await GET(new Request('http://localhost/api/openai/search?input=hello'));
        const secondResponse = await GET(new Request('http://localhost/api/openai/search?input=hello'));

        expect(firstResponse.status).toBe(200);
        expect(secondResponse.status).toBe(200);
        await expect(secondResponse.json()).resolves.toEqual(body);
        expect(createMock).toHaveBeenCalledTimes(1);
    });

    it('returns parsed JSON for successful responses', async () => {
        const body = { definitions: [{ openai: true, word: 'hello' }] };
        createMock.mockResolvedValueOnce({
            choices: [{ message: { content: JSON.stringify(body) } }]
        });
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=hello'));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual(body);
        expect(createMock.mock.calls[0][0].messages[1].content).toContain('"definitions"');
        expect(createMock.mock.calls[0][0].messages[1].content).toContain('"openai": true');
    });

    it('normalizes malformed successful responses to an empty definitions array', async () => {
        createMock.mockResolvedValueOnce({
            choices: [{ message: { content: JSON.stringify({ word: 'hello' }) } }]
        });
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=hello'));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ definitions: [] });
    });

    it('normalizes empty OpenAI message content to an empty definitions array', async () => {
        createMock.mockResolvedValueOnce({
            choices: [{ message: { content: '' } }]
        });
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=knock%20on%20wood'));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ definitions: [] });
    });

    it('uses specialized prompt templates when mode query parameter is provided', async () => {
        createMock.mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ definitions: [] }) } }]
        });
        const { GET } = await import('./route');

        // Test mode=similar
        await GET(new Request('http://localhost/api/openai/search?input=outbid&mode=similar'));
        expect(createMock.mock.calls[0][0].messages[1].content).toContain('You are an AI assistant specialized in comparing similar');

        // Test mode=context
        await GET(new Request('http://localhost/api/openai/search?input=outbid&mode=context'));
        expect(createMock.mock.calls[1][0].messages[1].content).toContain('You are an AI assistant specialized in providing contextual examples');

        // Test mode=phrase
        await GET(new Request('http://localhost/api/openai/search?input=outbid&mode=phrase'));
        expect(createMock.mock.calls[2][0].messages[1].content).toContain('You are an AI assistant specialized in explaining common phrases');
    });
});
