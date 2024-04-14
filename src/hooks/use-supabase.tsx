import { SearchResults } from '@/types';
import { createClient } from '@/utils/supabase/server';

import { cookies } from 'next/headers';

export default function useSupabase() {
    const cookieStore = cookies();
    return createClient(cookieStore);
}

export async function useSupbabaseAdmin() {
    const supabase = useSupabase();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user || userData.user.id !== process.env.THUCNE_ID!) {
        await supabase.auth.signInWithPassword({
            email: 'trongthuc.bentre@gmail.com',
            password: process.env.THUCNE_PASS!
        });
    }

    return supabase;
}

type SupabaseLexicon = { searchResults: SearchResults; word: string };

export async function useSupabaseLexicon(word: string): Promise<{ data: SupabaseLexicon; error: any }> {
    const supabase = useSupabase();

    const { data, error } = await supabase.from('Lexicon').select('*').eq('word', word).single();

    return { data: data! as SupabaseLexicon, error };
}

export async function useSupabaseLexiconId(word: string) {
    const supabase = useSupabase();

    const { data } = await supabase.from('Lexicon').select('id').eq('word', word);

    const id = data?.[0]?.id;

    return id;
}
