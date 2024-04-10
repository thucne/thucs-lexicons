import HomePage from '@/components/organisms/HomePage';
import useSupabase from '@/hooks/use-supabase';

export default async function Home() {
    const supabase = useSupabase();

    const { data, error } = await supabase.from('test').select('*');

    console.log(data, error);

    return <HomePage />;
}
