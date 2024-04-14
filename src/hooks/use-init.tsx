'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getFavorites } from '@/redux/reducers/favoriteLexicons';
import { handshake, selectLoggedInStatus } from '@/redux/reducers/auth';

enum Status {
    NotRun = 'NotRun',
    Handshaking = 'Handshaking',
    Handshaked = 'Handshaked',
    Loading = 'Loading',
    Loaded = 'Loaded'
}

export const useInit = () => {
    const [status, setStatus] = useState(Status.NotRun);
    const dispatch = useAppDispatch();
    const loggedIn = useAppSelector(selectLoggedInStatus);

    useEffect(() => {
        setStatus(Status.Handshaking);
        dispatch(handshake()).finally(() => {
            setStatus(Status.Handshaked);
        });
    }, [dispatch]);

    useEffect(() => {
        if (status === Status.Handshaked && loggedIn) {
            setStatus(Status.Loading);
            dispatch(getFavorites()).finally(() => {
                setStatus(Status.Loaded);
            });
        }
    }, [dispatch, loggedIn, status]);

    return status;
};
