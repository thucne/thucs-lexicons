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
        createMock.mockReset();
    });

    it('returns 400 for missing input', async () => {
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search'));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: 'Input parameter is required.' });
        expect(createMock).not.toHaveBeenCalled();
    });

    it('returns 502 when OpenAI throws', async () => {
        vi.resetModules();
        createMock.mockRejectedValueOnce(new Error('OpenAI unavailable'));
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=hello'));

        expect(response.status).toBe(502);
        await expect(response.json()).resolves.toEqual({ error: 'Failed to fetch definition.' });
    });

    it('returns 429 when the search route rate limit is exceeded', async () => {
        vi.resetModules();
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

    it('returns parsed JSON for successful responses', async () => {
        vi.resetModules();
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
        vi.resetModules();
        createMock.mockResolvedValueOnce({
            choices: [{ message: { content: JSON.stringify({ word: 'hello' }) } }]
        });
        const { GET } = await import('./route');

        const response = await GET(new Request('http://localhost/api/openai/search?input=hello'));

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toEqual({ definitions: [] });
    });
});
