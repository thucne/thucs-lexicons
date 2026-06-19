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
