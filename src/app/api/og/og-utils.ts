export const MAX_OG_WORD = 80;
export const MAX_OG_DEFINITION = 500;
export const DEFAULT_OG_WORD = 'Hello, World!';

type SafeOgParams =
    | {
          ok: true;
          word: string;
          definition: string;
      }
    | {
          ok: false;
          error: string;
      };

export const getSafeOgParams = (searchParams: URLSearchParams): SafeOgParams => {
    const word = searchParams.get('word') ?? DEFAULT_OG_WORD;

    if (word.length > MAX_OG_WORD) {
        return { ok: false, error: 'word too long' };
    }

    return {
        ok: true,
        word,
        definition: (searchParams.get('definition') || '').slice(0, MAX_OG_DEFINITION)
    };
};

export const buildOgImageUrl = (word: string, definition: string) => {
    const params = new URLSearchParams({
        word: word.slice(0, MAX_OG_WORD),
        definition: definition.slice(0, MAX_OG_DEFINITION)
    });

    return `/api/og?${params.toString()}`;
};
