'use client';
import { AppStore, makeStore } from '@/redux/store';
import { PropsWithChildren, useRef } from 'react';

import { Provider } from 'react-redux';

const StoreProvider = ({ children }: PropsWithChildren) => {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = makeStore();
    }
    return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
