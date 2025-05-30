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
  The input could be a word, phrase, or even a misspelled word/phrase. 
  
  For each word or phrase, provide the following fields:
    - "word": The original input word or phrase.
    - "didYouMean": If the input was misspelled, provide the corrected spelling of the word. If not, this field should be null.
    - "phonetic": The phonetic spelling of the word, if available.
    - "phonetics": An array of phonetic representations of the word, each with a "text" field for the phonetic transcription and an "audio" field for the audio link of the pronunciation.
    - "origin": The origin of the word, if available.
    - "meanings": An array of meanings associated with the word, each with a "partOfSpeech" field and a "definitions" field.
      The "definitions" field should be an array of objects, each containing:
        - "definition": The definition of the word.
        - "example": An example sentence using the definition.
        - "synonyms": An array of synonyms for the word.
        - "antonyms": An array of antonyms for the word.

  Note that the phonetic should inside the slashes, like this: /ˈfɪlɪŋ/ for "filling".
    
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
            temperature: 0.5,
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
                                            description: 'The original input word or phrase.',
                                        },
                                        didYouMean: {
                                            type: 'string',
                                            description: 'If the input was misspelled, this field contains the corrected spelling of the word.',
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
