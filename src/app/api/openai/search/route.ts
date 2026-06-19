import OpenAI from 'openai';

const API_KEY = process.env.OPENAI_API_KEY;

const openAI = new OpenAI({
    apiKey: API_KEY
});

const prompt = (input: string) => `
You are an AI assistant specialized in providing accurate definitions and explanations of words and phrases.

For the given input, your primary goal is to provide a comprehensive and easy-to-understand definition. However, if the input is clearly a **misspelling** or **does not correspond to any known word or phrase**, it is crucial to indicate this rather than attempting to define something nonsensical.

If you are **certain** the input is a valid word or phrase (even if a common misspelling that you can correct), return a JSON object with a "definitions" array. If you are **uncertain** or if the input is **gibberish/meaningless**, return { "definitions": [] }.

The response must match this wrapper shape:
{
  "definitions": [
    {
      "openai": true,
      "word": "original input word or phrase",
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
  - "word" is the original input word or phrase.
  - "didYouMean" is the corrected spelling for common misspellings, otherwise null.
  - "phonetic" is a single string; use an empty string if unavailable.
  - "phonetics" is an array of { "text", "audio" }; use null for unavailable audio.
  - "origin" is a string; use an empty string if unavailable.
  - "meanings[].definitions[].example" is a string; use an empty string if unavailable.
  - "synonyms" and "antonyms" must be arrays, empty when none are available.

Now, provide the definition for "${input}" in the specified JSON format.
`;

const normalizeSearchResult = (result: unknown) => {
    if (typeof result === 'object' && result !== null && 'definitions' in result && Array.isArray(result.definitions)) {
        return result;
    }

    return { definitions: [] };
};

const search = async (input: string) => {
    try {
        const response = await openAI.chat.completions.create({
            model: 'gpt-5-nano',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that provides definitions and explanations, phonetic, synonyms, antonyms...'
                },
                {
                    role: 'user',
                    content: prompt(input)
                }
            ],
            max_completion_tokens: 1000,
            temperature: 0.2,
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
                                            description: 'The original input word or phrase.'
                                        },
                                        didYouMean: {
                                            type: 'string',
                                            description:
                                                'If the input was misspelled, this field contains the corrected spelling of the word.',
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

        return normalizeSearchResult(JSON.parse(response.choices[0].message.content ?? '{}'));
    } catch (error) {
        console.error('Error during OpenAI search:', error);
        throw error;
    }
};

const statusForOpenAIError = (error: unknown) =>
    typeof error === 'object' && error !== null && 'status' in error && error.status === 429 ? 503 : 502;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const input = (searchParams.get('input') ?? '').trim();

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

    try {
        const result = await search(input);

        return Response.json(result);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch definition.' }, { status: statusForOpenAIError(error) });
    }
}
