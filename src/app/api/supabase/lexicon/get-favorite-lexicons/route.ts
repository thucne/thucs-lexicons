import { cookies } from 'next/headers';
import useSupabase from '@/hooks/use-supabase';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {
        const supabase = useSupabase();
        const cookieStore = cookies();
        const lexiconToken = cookieStore.get('lexiconToken');

        if (!lexiconToken || !lexiconToken.value) {
            return new Response('Unauthorized', { status: 401 });
        }

        const jwtToken = jwt.verify(lexiconToken.value, process.env.JWT_SECRET!) as { email: string };

        if (!jwtToken) {
            throw new Error('Invalid token');
        }

        const { email } = jwtToken;

        // check if logged in
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user || userData.user.id !== process.env.THUCNE_ID!) {
            await supabase.auth.signInWithPassword({
                email: 'trongthuc.bentre@gmail.com',
                password: process.env.THUCNE_PASS!
            });
        }

        // find favorite lexicon where createdBy = email and lexicon = inputObj.word
        const { data } = await supabase.from('FavoriteLexicon').select().eq('createdBy', email);

        return new Response(JSON.stringify(data));
    } catch (error) {
        return new Response('Error saving favorite lexicons');
    }
}
