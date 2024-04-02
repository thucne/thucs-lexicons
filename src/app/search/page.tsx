'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Search() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    return <div>Hello, this is the search page for query: {query}</div>;
}

const SearchPage = () => {
    return (
        <Suspense>
            <Search />
        </Suspense>
    );
};

export default SearchPage;
