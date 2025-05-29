import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;

const openAI = new OpenAI({
    apiKey: API_KEY
});

const prompt = (input: string) => `
  You are an AI assistant that will tell the website if the word/phrase has a definition or not.
  The word/phrase could be misspelled/mistyped by the user, so you should be able to recognize it and try to find a definition for the corrected version.

  If you think we could have any definition for the word/phrase, return true, otherwise return false.
  Now, analyze this: ${input}
`;

const search = async (input: string) => {
    try {
        const response = await openAI.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful assistant that determines if a word or phrase has a definition.'
                },
                {
                    role: 'user',
                    content: prompt(input)
                }
            ],
            max_completion_tokens: 10,
            temperature: 0.7,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'boolean_value',
                    schema: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'boolean',
                                description: 'A boolean value, either true or false.'
                            }
                        },
                        required: ['value'],
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
