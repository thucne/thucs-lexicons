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
