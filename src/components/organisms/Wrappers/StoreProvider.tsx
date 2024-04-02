'use client';
import { AppStore, makeStore } from '@/redux/store';
import { PropsWithChildren, useRef } from 'react';

import { Provider } from 'react-redux';

const StoreProvider = ({ children }: PropsWithChildren) => {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }
    return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
