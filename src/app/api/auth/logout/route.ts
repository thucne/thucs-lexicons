import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function GET() {
    try {
        const cookieStore = cookies();

        cookieStore.set('lexiconToken', '', { expires: new Date(0) });

        return new Response(JSON.stringify({ result: 1 }));
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ result: 0 }));
    }
}
