import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { useSupbabaseAdmin } from '@/hooks/use-supabase';

export async function DELETE() {
    try {
        const supabase = await useSupbabaseAdmin();
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

        // delete all favorite lexicons where createdBy = email
        await supabase.from('FavoriteLexicon').delete().eq('createdBy', email);

        return new Response('Favorite lexicons cleared');
    } catch (error) {
        return new Response('Error saving favorite lexicons', { status: 500 });
    }
}
