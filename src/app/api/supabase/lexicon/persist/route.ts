import useSupabase from '@/hooks/use-supabase';
import { SearchResultsSupabase } from '@/types';

type LexiconBody = SearchResultsSupabase;

function validateObj(obj: LexiconBody): boolean;
function validateObj(arrObj: LexiconBody[]): boolean;
function validateObj(arg: LexiconBody | LexiconBody[]): boolean {
    if (Array.isArray(arg)) {
        return arg.every((obj) => validateObj(obj));
    }

    return Boolean(arg.word && arg.searchResults);
}

export async function POST(request: Request) {
    const supabase = useSupabase();

    try {

        const inputObj = await request.json();

        if (!validateObj(inputObj)) {
            throw new Error('Invalid input object');
        }

        // check if logged in
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user || userData.user.id !== process.env.THUCNE_ID!) {
            await supabase.auth.signInWithPassword({
                email: 'trongthuc.bentre@gmail.com',
                password: process.env.THUCNE_PASS!
            });
        }

        // save
        const { data, error } = await supabase.from('Lexicon').upsert(inputObj, { onConflict: 'word' }).select();

        if (error) {
            throw new Error('Error persisting data');
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'content-type': 'application/json'
            }
        });
    } catch (error) {
        return new Response('Error persisting data');
    } finally {
        await supabase.auth.signOut();
    }
}
