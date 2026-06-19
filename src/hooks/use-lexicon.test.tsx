import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FREE_DICTIONARY_API, OPENAI_MEANING_API, OPENAI_MEANING_CHECK_API } from '@/constants';

const useSWRMock = vi.hoisted(() => vi.fn());
const domain = process.env.NEXT_PUBLIC_DOMAIN || '';

vi.mock('swr', () => ({
    default: useSWRMock
}));

describe('useLexicon hooks', () => {
    beforeEach(() => {
        useSWRMock.mockReset();
        useSWRMock.mockReturnValue({ data: undefined, isLoading: false });
    });

    it('passes an encoded dictionary URL to SWR', async () => {
        const { useLexicon } = await import('./use-lexicon');

        useLexicon('break the ice');

        expect(useSWRMock.mock.calls[0][0]).toBe(`${FREE_DICTIONARY_API}/break%20the%20ice`);
    });

    it('passes null to SWR when dictionary word is absent', async () => {
        const { useLexicon } = await import('./use-lexicon');

        useLexicon();

        expect(useSWRMock.mock.calls[0][0]).toBeNull();
    });

    it('passes an encoded AI search URL to SWR', async () => {
        const { useLexiconWithAI } = await import('./use-lexicon');

        useLexiconWithAI('affect vs effect');

        expect(useSWRMock.mock.calls[0][0]).toBe(`${domain}${OPENAI_MEANING_API}?input=affect%20vs%20effect`);
    });

    it('passes an encoded AI meaning-check URL to SWR', async () => {
        const { useLexiconWithAICheck } = await import('./use-lexicon');

        useLexiconWithAICheck('café');

        expect(useSWRMock.mock.calls[0][0]).toBe(`${domain}${OPENAI_MEANING_CHECK_API}?input=caf%C3%A9`);
    });
});
