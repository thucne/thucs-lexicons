import useSupabase from '@/hooks/use-supabase';

export async function GET(request: Request) {
    try {
        const supabase = useSupabase();
        const { searchParams } = new URL(request.url);

        const word = searchParams.get('word');

        if (!word) {
            return new Response('Invalid request', { status: 400 });
        }

        const words = word.split(',');

        const { data, error } = await supabase.from('Lexicon').select().in('word', words);

        if (error) {
            return new Response('Error fetching data', { status: 500 });
        }

        return new Response(JSON.stringify(data), {
            headers: {
                'content-type': 'application/json'
            }
        });
    } catch (error) {
        return new Response('Error fetching data', { status: 500 });
    }
}
