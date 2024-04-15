'use client';

import { useState, useEffect } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, Box } from '@mui/material';
import { cancelLoginRequest, login, resetLogin, selectCallbackUrl, selectShowLoginDialog } from '@/redux/reducers/auth';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { setAuthStatus } from '@/redux/reducers/authStatus';
import { AuthStatus } from '@/hooks/use-init';
import { getFavorites } from '@/redux/reducers/favoriteLexicons';

const constructLoginUrl = (callbackUrl: string) => {
    return `/api/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

declare const window: any;
declare const google: any;

const LoginMessageDialog = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const callbackUrl = useAppSelector(selectCallbackUrl);
    const showLoginDialog = useAppSelector(selectShowLoginDialog);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        let tryAgain: ReturnType<typeof setInterval>;

        if (window?.google && google) {
            const handleCredentialResponse = async (response: any) => {
                try {
                    const { credential } = response;

                    setIsLoggingIn(true);
                    dispatch(setAuthStatus(AuthStatus.Handshaking));

                    await dispatch(login(credential)).finally(() => {
                        dispatch(setAuthStatus(AuthStatus.Handshaked));
                    });

                    dispatch(setAuthStatus(AuthStatus.Loading));
                    dispatch(getFavorites()).finally(() => {
                        dispatch(setAuthStatus(AuthStatus.Loaded));
                    });

                    if (callbackUrl) {
                        router.push(callbackUrl);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoggingIn(false);
                }
            };

            tryAgain = setInterval(() => {
                google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse
                });
                const parent = document.getElementById('google_btn');

                if (parent) {
                    google.accounts.id.renderButton(parent, {
                        theme: 'filled_black',
                        text: 'login_with',
                        shape: 'pill',
                        logo_alignment: 'left',
                        width: '240'
                    });
                    clearInterval(tryAgain);
                }
            }, 250);
        }

        return () => tryAgain && clearInterval(tryAgain);
    }, [showLoginDialog, callbackUrl, router, dispatch]);

    const handleClose = (success: boolean) => {
        dispatch(resetLogin({ success }));
    };

    return (
        <Dialog open={showLoginDialog} maxWidth="xs" onClose={isLoggingIn ? undefined : () => handleClose(false)}>
            <DialogTitle>To continue, please login with Google!</DialogTitle>
            <DialogContent dividers>
                <Typography variant="caption" color="warning.main" className="mt-2">
                    If you don&apos;t have any Google account, you may need to create one first.
                </Typography>
                <Box className="mt-3">
                    <div id="google_btn" />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    size="small"
                    onClick={() => dispatch(cancelLoginRequest())}
                    sx={{ textTransform: 'none' }}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? 'Logging in...' : 'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginMessageDialog;
