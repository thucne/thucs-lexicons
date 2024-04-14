import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client();

async function verify(token: string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    return email;
}

export async function POST(request: Request) {
    try {
        const { token } = await request.json();
        const email = await verify(token);
        const cookieStore = cookies();

        if (!email) {
            return new Response('Invalid token', { status: 400 });
        }

        const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        // set cookie
        cookieStore.set('lexiconToken', jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000 - 1000)
        });

        return new Response('OK', { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response('Internal server error', { status: 500 });
    }
}
