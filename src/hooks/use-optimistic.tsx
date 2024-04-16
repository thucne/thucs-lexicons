'use client';
import { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';

export function useOptimistic<T, P>(passthrough: T, reducer: (state: T, payload: P) => T) {
    const reducerRef = useRef(reducer);
    const [value, setValue] = useState(passthrough);

    useEffect(() => {
        setValue(passthrough);
    }, [passthrough]);

    useLayoutEffect(() => {
        reducerRef.current = reducer;
    }, [reducer]);

    const dispatch = useCallback(
        (payload: P) => {
            setValue(reducerRef.current(passthrough, payload));
        },
        [passthrough]
    );

    return [value, dispatch] as const;
}
