import { rateLimitOrThrow } from '@/lib/rate-limit';
import { getOpenAIClient, MissingOpenAIKeyError } from '@/lib/openai-config';
import { consumeOpenAIBudgetOrThrow, getCachedOpenAIResult, setCachedOpenAIResult } from '@/lib/openai-usage-guard';
import type { SearchResults } from '@/types';
import { extractCoreWord } from '@/utils';

type AIResult = {
    definitions: SearchResults;
};

const localFallbacks: Record<string, AIResult> = {
    'affect vs effect': {
        definitions: [
            {
                openai: true,
                word: 'affect vs effect',
                phonetic: '',
                phonetics: [],
                origin: '',
                meanings: [
                    {
                        partOfSpeech: 'usage',
                        definitions: [
                            {
                                definition: 'Affect is usually a verb meaning to influence or change something.',
                                example: 'The cold weather can affect your mood.',
                                synonyms: ['influence', 'change', 'shape'],
                                antonyms: []
                            },
                            {
                                definition: 'Effect is usually a noun meaning a result or consequence.',
                                example: 'The new policy had a positive effect on attendance.',
                                synonyms: ['result', 'outcome', 'consequence'],
                                antonyms: []
                            },
                            {
                                definition:
                                    'Effect can also be a formal verb meaning to bring something about, as in "effect change."',
                                example: 'The committee hoped to effect meaningful reform.',
                                synonyms: ['produce', 'cause', 'achieve'],
                                antonyms: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'break the ice': {
        definitions: [
            {
                openai: true,
                word: 'break the ice',
                phonetic: '',
                phonetics: [],
                origin: '',
                meanings: [
                    {
                        partOfSpeech: 'idiom',
                        definitions: [
                            {
                                definition:
                                    'To make people feel more relaxed and willing to talk, especially at the start of a meeting or conversation.',
                                example: 'She told a quick story to break the ice before the workshop began.',
                                synonyms: ['start a conversation', 'ease tension', 'warm up'],
                                antonyms: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'resilience in a sentence': {
        definitions: [
            {
                openai: true,
                word: 'resilience in a sentence',
                phonetic: '',
                phonetics: [],
                origin: '',
                meanings: [
                    {
                        partOfSpeech: 'example',
                        definitions: [
                            {
                                definition:
                                    'Use resilience to describe the ability to recover, adapt, or keep going after difficulty.',
                                example: 'Her resilience helped the team recover after a difficult launch.',
                                synonyms: ['strength', 'adaptability', 'perseverance'],
                                antonyms: ['fragility']
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

const prompt = (input: string) => `
You are an AI assistant specialized in providing accurate definitions and explanations of words and phrases.

For the given input, your primary goal is to provide a comprehensive and easy-to-understand definition. However, if the input is clearly a **misspelling** or **does not correspond to any known word or phrase**, it is crucial to indicate this rather than attempting to define something nonsensical.

If you are **certain** the input is a valid word or phrase, return a JSON object with a "definitions" array.
If the input is a common typo or misspelling that you can confidently correct, return definitions for the corrected word or phrase, not for the typo.
If you are **uncertain** or if the input is **gibberish/meaningless**, return { "definitions": [] }.

The response must match this wrapper shape:
{
  "definitions": [
    {
      "openai": true,
      "word": "word or phrase being defined; use the corrected spelling for typos",
      "didYouMean": null,
      "phonetic": "/primary phonetic spelling/",
      "phonetics": [{ "text": "/phonetic transcription/", "audio": null }],
      "origin": "",
      "meanings": [
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "specific definition",
              "example": "",
              "synonyms": [],
              "antonyms": []
            }
          ]
        }
      ]
    }
  ]
}

For each definition:
  - "openai" must always be true.
  - "word" is the exact word or phrase being defined. For typos, use the corrected spelling.
  - "didYouMean" is the corrected spelling for common misspellings, otherwise null. For typos, this should match "word".
  - "phonetic" is a single string; use an empty string if unavailable.
  - "phonetics" is an array of { "text", "audio" }; use null for unavailable audio.
  - "origin" is a string; use an empty string if unavailable.
  - "meanings[].definitions[].example" is a string; use an empty string if unavailable.
  - "synonyms" and "antonyms" must be arrays, empty when none are available.

Now, provide the definition for "${input}" in the specified JSON format.
`;

const comparePrompt = (coreWord: string) => `
You are an AI assistant specialized in comparing similar or easily confused words.

For the core word "${coreWord}":
1. Identify a word that is a direct semantic counterpart, synonym, antonym, or commonly compared/confused word with "${coreWord}" (e.g., "outprice" or "underbid" or "outcompete" for "outbid", or "excellent" for "splendid"). Avoid generic or unrelated words.
2. Compare the two words.
3. In the returned JSON, you MUST return EXACTLY TWO separate entries in the "definitions" array:
   - The first entry MUST be the definition of "${coreWord}". The "word" field for this entry MUST be exactly "${coreWord}".
   - The second entry MUST be the definition of the compared word that you selected. The "word" field for this entry MUST be exactly that compared word.
   - For both entries:
     - The "didYouMean" field must be a JSON null (not the string "null").
     - Under "meanings", provide standard dictionary definitions for that word, along with example sentences and synonyms/antonyms.

Return the result in the following JSON format:
{
  "definitions": [
    {
      "openai": true,
      "word": "${coreWord}",
      "didYouMean": null,
      "phonetic": "",
      "phonetics": [],
      "origin": "",
      "meanings": [
        {
          "partOfSpeech": "verb",
          "definitions": [
            {
              "definition": "Definition of ${coreWord}.",
              "example": "An example sentence using ${coreWord}.",
              "synonyms": ["synonym1"],
              "antonyms": ["antonym1"]
            }
          ]
        }
      ]
    },
    {
      "openai": true,
      "word": "[compared_word]",
      "didYouMean": null,
      "phonetic": "",
      "phonetics": [],
      "origin": "",
      "meanings": [
        {
          "partOfSpeech": "verb",
          "definitions": [
            {
              "definition": "Definition of [compared_word].",
              "example": "An example sentence using [compared_word].",
              "synonyms": ["synonym2"],
              "antonyms": ["antonym2"]
            }
          ]
        }
      ]
    }
  ]
}
`;

const contextPrompt = (coreWord: string) => `
You are an AI assistant specialized in providing contextual examples and usage guidance for words and phrases.

For the word "${coreWord}":
1. Explain how to use "${coreWord}" in a sentence.
2. Provide natural, clear example sentences showing the word in action.
3. In the returned JSON:
   - The "word" field MUST be exactly "${coreWord}".
   - The "didYouMean" field must be a JSON null (not the string "null").
   - Under "meanings", provide a context/usage explanation:
     - Set "partOfSpeech" to "example".
     - Under "definitions", provide a definition explaining how the word is used in a sentence, along with a high-quality example sentence in the "example" field.

Return the result in the following JSON format:
{
  "definitions": [
    {
      "openai": true,
      "word": "${coreWord}",
      "didYouMean": null,
      "phonetic": "",
      "phonetics": [],
      "origin": "",
      "meanings": [
        {
          "partOfSpeech": "example",
          "definitions": [
            {
              "definition": "Explanation of how to use '${coreWord}' in a sentence.",
              "example": "A clear, natural example sentence showing how to use '${coreWord}' in context.",
              "synonyms": ["synonym1"],
              "antonyms": []
            }
          ]
        }
      ]
    }
  ]
}
`;

const phrasePrompt = (coreWord: string) => `
You are an AI assistant specialized in explaining common phrases, idioms, and collocations.

For the word "${coreWord}":
1. Identify common phrases, idioms, or collocations containing "${coreWord}".
2. Explain their meanings and provide example sentences.
3. In the returned JSON:
   - The "word" field MUST be exactly "${coreWord}".
   - The "didYouMean" field must be a JSON null (not the string "null").
   - Under "meanings", provide a definition block for each identified phrase:
     - Set "partOfSpeech" to "phrase" or "idiom".
     - IMPORTANT: The "definition" field for each definition item MUST start with the phrase itself, followed by a colon and the definition. Format: "[phrase]: [definition]". For example: "to outbid someone: to offer a higher price than another bidder." or "outbid at auction: to be surpassed by another bidder in an auction setting."

Return the result in the following JSON format:
{
  "definitions": [
    {
      "openai": true,
      "word": "${coreWord}",
      "didYouMean": null,
      "phonetic": "",
      "phonetics": [],
      "origin": "",
      "meanings": [
        {
          "partOfSpeech": "phrase",
          "definitions": [
            {
              "definition": "phrase 1: Definition of the first phrase containing '${coreWord}'.",
              "example": "An example sentence using that phrase.",
              "synonyms": ["synonym1"],
              "antonyms": []
            },
            {
              "definition": "phrase 2: Definition of the second phrase containing '${coreWord}'.",
              "example": "An example sentence using that phrase.",
              "synonyms": ["synonym2"],
              "antonyms": []
            }
          ]
        }
      ]
    }
  ]
}
`;

const normalizeSearchResult = (result: unknown): AIResult => {
    if (typeof result === 'object' && result !== null && 'definitions' in result && Array.isArray(result.definitions)) {
        return { definitions: result.definitions as SearchResults };
    }

    return { definitions: [] };
};

const parseSearchResult = (content: string | null | undefined): AIResult => {
    const trimmedContent = content?.trim();

    if (!trimmedContent) {
        return { definitions: [] };
    }

    try {
        return normalizeSearchResult(JSON.parse(trimmedContent));
    } catch {
        return { definitions: [] };
    }
};

const getLocalFallback = (input: string): AIResult | undefined => localFallbacks[input.toLowerCase()];

const search = async (input: string, mode?: string) => {
    try {
        const openAI = getOpenAIClient();
        const model = process.env.OPENAI_MODEL || 'gpt-5-nano';
        const gpt5Options = model.startsWith('gpt-5')
            ? ({
                  reasoning_effort: 'minimal',
                  verbosity: 'low'
              } as const)
            : {};
        let promptText = '';
        const trimmedInput = input.trim();
        const coreWord = extractCoreWord(trimmedInput);

        const activeMode = mode || (
            /\bvs\s+(?:a\s+)?similar\s+word$/i.test(trimmedInput) ? 'similar' :
            /\bin\s+a\s+sentence$/i.test(trimmedInput) ? 'context' :
            /^common\s+phrases\s+with\b/i.test(trimmedInput) ? 'phrase' : ''
        );

        if (activeMode === 'similar') {
            promptText = comparePrompt(coreWord);
        } else if (activeMode === 'context') {
            promptText = contextPrompt(coreWord);
        } else if (activeMode === 'phrase') {
            promptText = phrasePrompt(coreWord);
        } else {
            promptText = prompt(trimmedInput);
        }

        const response = await openAI.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that provides definitions and explanations, phonetic, synonyms, antonyms...'
                },
                {
                    role: 'user',
                    content: promptText
                }
            ],
            max_completion_tokens: 2000,
            ...gpt5Options,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'dictionary_definitions',
                    schema: {
                        type: 'object',
                        properties: {
                            definitions: {
                                type: 'array',
                                description: 'An array of found definitions.',
                                items: {
                                    type: 'object',
                                    properties: {
                                        openai: {
                                            type: 'boolean',
                                            description:
                                                'always true, indicates that this definition is provided by OpenAI.'
                                        },
                                        word: {
                                            type: 'string',
                                            description:
                                                'The word or phrase being defined. For typos, use the corrected spelling.'
                                        },
                                        didYouMean: {
                                            type: 'string',
                                            description:
                                                'If the input was misspelled, this field contains the corrected spelling of the word or phrase.',
                                            nullable: true
                                        },
                                        phonetic: {
                                            type: 'string',
                                            description: 'Phonetic spelling of the word.'
                                        },
                                        phonetics: {
                                            type: 'array',
                                            description: 'Phonetic representations of the word.',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    text: {
                                                        type: 'string',
                                                        description: 'Phonetic transcription.'
                                                    },
                                                    audio: {
                                                        type: 'string',
                                                        description: 'Audio link for pronunciation.',
                                                        nullable: true
                                                    }
                                                },
                                                required: ['text', 'audio'],
                                                additionalProperties: false
                                            }
                                        },
                                        origin: {
                                            type: 'string',
                                            description: 'The origin of the word.'
                                        },
                                        meanings: {
                                            type: 'array',
                                            description: 'Meanings associated with the word.',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    partOfSpeech: {
                                                        type: 'string',
                                                        description: 'Part of speech for the meaning.'
                                                    },
                                                    definitions: {
                                                        type: 'array',
                                                        description: 'Definitions related to the part of speech.',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                definition: {
                                                                    type: 'string',
                                                                    description: 'The definition of the word.'
                                                                },
                                                                example: {
                                                                    type: 'string',
                                                                    description:
                                                                        'Example sentence using the definition.'
                                                                },
                                                                synonyms: {
                                                                    type: 'array',
                                                                    description: 'List of synonyms.',
                                                                    items: {
                                                                        type: 'string'
                                                                    }
                                                                },
                                                                antonyms: {
                                                                    type: 'array',
                                                                    description: 'List of antonyms.',
                                                                    items: {
                                                                        type: 'string'
                                                                    }
                                                                }
                                                            },
                                                            required: ['definition', 'example', 'synonyms', 'antonyms'],
                                                            additionalProperties: false
                                                        }
                                                    }
                                                },
                                                required: ['partOfSpeech', 'definitions'],
                                                additionalProperties: false
                                            }
                                        }
                                    },
                                    required: [
                                        'openai',
                                        'word',
                                        'phonetic',
                                        'phonetics',
                                        'origin',
                                        'meanings',
                                        'didYouMean'
                                    ],
                                    additionalProperties: false
                                }
                            }
                        },
                        required: ['definitions'],
                        additionalProperties: false
                    },
                    strict: true
                }
            }
        });

        return parseSearchResult(response.choices[0]?.message.content);
    } catch (error) {
        console.error('Error during OpenAI search:', error);
        throw error;
    }
};

const statusForOpenAIError = (error: unknown) =>
    error instanceof MissingOpenAIKeyError ||
    (typeof error === 'object' && error !== null && 'status' in error && error.status === 429)
        ? 503
        : 502;

const errorMessageForOpenAIError = (error: unknown) =>
    error instanceof MissingOpenAIKeyError ? 'AI search is not configured.' : 'Failed to fetch definition.';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const input = (searchParams.get('input') ?? '').trim();
    const mode = (searchParams.get('mode') ?? '').trim().toLowerCase();

    if (!input) {
        return new Response(JSON.stringify({ error: 'Input parameter is required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (input.length > 100) {
        return new Response(JSON.stringify({ error: 'Input parameter exceeds maximum length of 100 characters.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const cacheKey = mode ? `${input}?mode=${mode}` : input;

    const localFallback = getLocalFallback(input);

    if (localFallback) {
        return Response.json(localFallback);
    }

    const cached = getCachedOpenAIResult(cacheKey);

    if (cached) {
        return Response.json(cached);
    }

    const limited = await rateLimitOrThrow(request, 'openai-search');
    if (limited) {
        return limited;
    }

    const budgetLimited = consumeOpenAIBudgetOrThrow();
    if (budgetLimited) {
        return budgetLimited;
    }

    try {
        const result = await search(input, mode);

        setCachedOpenAIResult(cacheKey, result);

        return Response.json(result);
    } catch (error) {
        return Response.json({ error: errorMessageForOpenAIError(error) }, { status: statusForOpenAIError(error) });
    }
}
