'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getFavorites } from '@/redux/reducers/favoriteLexicons';
import { handshake, selectLoggedInStatus } from '@/redux/reducers/auth';
import { AuthStatus } from '@/types';

export const useInit = () => {
    const [status, setStatus] = useState(AuthStatus.NotRun);
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(selectLoggedInStatus);

    useEffect(() => {
        setStatus(AuthStatus.Handshaking);
        dispatch(handshake()).finally(() => {
            setStatus(AuthStatus.Handshaked);
        });
    }, [dispatch]);

    useEffect(() => {
        if (status === AuthStatus.Handshaked) {
            if (loggedIn) {
                setStatus(AuthStatus.Loading);
                dispatch(getFavorites()).finally(() => {
                    setStatus(AuthStatus.Loaded);
                });
            } else {
                setStatus(AuthStatus.Loaded);
            }
        }
    }, [dispatch, loggedIn, status]);

    return status;
};
