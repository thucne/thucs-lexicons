'use client';
import { useEffect } from 'react';
import { useInit } from '@/hooks/use-init';
import { useAppDispatch } from '@/redux/store';
import { setAuthStatus } from '@/redux/reducers/authStatus';

const Init = () => {
    const status = useInit();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setAuthStatus(status));
    }, [status, dispatch]);

    return null;
};

export default Init;
