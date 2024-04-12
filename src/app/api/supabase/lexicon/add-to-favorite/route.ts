import useSupabase from '@/hooks/use-supabase';
import { FavoriteLexiconSupabase } from '@/types';

type FavoriteLexiconBody = FavoriteLexiconSupabase;

export async function POST(request: Request) {
    try {
        const supabase = useSupabase();

        const inputObj = await request.json();

        if (!inputObj.word) {
            throw new Error('Invalid input object');
        }

        const { data: userdata } = await supabase.auth.getUser();

        if (!userdata.user) {
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

        return new Response('Logged in');
    } catch (error) {
        return new Response('Error saving favorite lexicons');
    }
}
