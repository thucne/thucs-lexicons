'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';

const SearchPage = () => {
    const searchParams = useSearchParams();

    const query = searchParams.get('q');

    return <div>Hello, this is the search page for query: {query}</div>;
};

export default SearchPage;
