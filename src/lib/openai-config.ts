import OpenAI from 'openai';

export class MissingOpenAIKeyError extends Error {
    constructor() {
        super('OpenAI API key is not configured.');
        this.name = 'MissingOpenAIKeyError';
    }
}

export const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new MissingOpenAIKeyError();
    }

    return new OpenAI({ apiKey });
};
