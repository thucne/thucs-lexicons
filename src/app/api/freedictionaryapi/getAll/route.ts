import useSupabase from '@/hooks/use-supabase';

export async function GET() {
    try {
        const supabase = useSupabase();

        // select only fields "word" and last modified date
        const { data, error } = await supabase.from('Lexicon').select('word').order('word', { ascending: true });
        const words = data?.map((i) => i.word) || [];

        if (error) {
            return new Response('Error fetching data', { status: 500 });
        }

        return new Response(JSON.stringify(words), {
            headers: {
                'content-type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response('Error fetching data', { status: 500 });
    }
}
