import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        const cookieStore = cookies();
        const lexiconToken = cookieStore.get('lexiconToken');

        if (!lexiconToken || !lexiconToken.value) {
            throw new Error('Unauthorized');
        }

        const jwtToken = jwt.verify(lexiconToken.value, process.env.JWT_SECRET!) as { email: string };

        if (!jwtToken) {
            throw new Error('Invalid token');
        }

        const { email } = jwtToken;

        // re-issue token with new expiration
        const newToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        cookieStore.set('lexiconToken', newToken, { path: '/', maxAge: 3600 });

        return new Response(JSON.stringify({ result: 1, email }));
    } catch (error) {
        return new Response(JSON.stringify({ result: 0 }));
    }
}
