import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const openAI = new OpenAI({
    apiKey: API_KEY
});

const prompt = (input: string) => `
  You are an AI assistant that helps to give definitions and explanations of words and phrases.
 
  Please ensure that your response is informative and easy to understand. Try to provide as much definition as possible, but keep it concise.

  Try to produce the IPA phonetic transcription of the word or phrase, if available. 
  Also try to give as much as possible information about the word or phrase, such as its origin, part of speech, synonyms, antonyms, and example sentences.

  If there is not valid definition for the input, tell that the input may not be a valid word or phrase, or that it is not in the dictionary.

  The user may misspell the word or phrase, so if you think the input is a misspelled word, try to correct it, put the corrected word or phrase under "correctedWord" field 
  and provide the corrected version in the response.

  Note that the phonetic should inside the slashes, like this: /ˈfɪlɪŋ/ for "filling".
  If the input is misspelled, "correctedWord" should be the corrected version of the input, not the phonetic, and "word" should be the original input.
    
  Now provide the definition for "${input}"
`;

const search = async (input: string) => {
    try {
        const response = await openAI.chat.completions.create({
            model: 'gpt-4.1-nano',
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
            temperature: 0.7,
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
                                            description: 'The word being defined.'
                                        },
                                        correctedWord: {
                                            type: 'string',
                                            description: 'The corrected word/phrase if the input was misspelled.',
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
                                        'correctedWord'
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

        return JSON.parse(response.choices[0].message.content ?? '{}');
    } catch (error) {
        console.error('Error during OpenAI search:', error);
        return {};
    }
};

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

    const result = await search(input);

    return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
    });
}
