import { cookies } from 'next/headers'
import useSupabase from '@/hooks/use-supabase';
import { FavoriteLexiconSupabase } from '@/types';
import jwt from 'jsonwebtoken';

type FavoriteLexiconBody = FavoriteLexiconSupabase;

export async function POST(request: Request) {
    try {
        const supabase = useSupabase();
        const cookieStore = cookies();
        const inputObj = await request.json();
        const lexiconToken = cookieStore.get('lexiconToken');

        if (!inputObj.word) {
            throw new Error('Invalid input object');
        }

        if (!lexiconToken || !lexiconToken.value) {
            // check if logged in
            const { data } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes: 'email'
                }
            });
            const logginUrl = data.url;
            // redirect
            return new Response(JSON.stringify({ url: logginUrl }));
        }

        const jwtToken = jwt.verify(lexiconToken.value, process.env.JWT_SECRET!) as { email: string };

        if (!jwtToken) {
            throw new Error('Invalid token');
        }

        const { email } = jwtToken;

        return new Response('Logged in with email: ' + email);
    } catch (error) {
        return new Response('Error saving favorite lexicons');
    }
}
