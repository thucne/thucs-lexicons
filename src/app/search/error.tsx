'use client';
import React from 'react';

const ErrorSearch = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
    return (
        <div>
            Failed to fetch data, please try again later.
            <button onClick={reset}>Retry</button>
        </div>
    );
};

export default ErrorSearch;
