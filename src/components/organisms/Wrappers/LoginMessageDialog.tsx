'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { cancelLoginRequest, login, resetLogin, selectCallbackUrl, selectShowLoginDialog } from '@/redux/reducers/auth';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { getFavorites } from '@/redux/reducers/favoriteLexicons';
import { selectAuthStatus } from '@/redux/reducers/authStatus';
import { AuthStatus } from '@/types';

declare const window: any;
declare const google: any;

const LoginMessageDialog = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const callbackUrl = useAppSelector(selectCallbackUrl);
    const showLoginDialog = useAppSelector(selectShowLoginDialog);
    const authStatus = useAppSelector(selectAuthStatus);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [failedToLoad, setFailedToLoad] = useState(false);

    const isLoading = authStatus !== AuthStatus.Loaded;
    const momoizedShowLoginDialog = useMemo(() => showLoginDialog, [showLoginDialog]);

    const handleCredentialResponse = useCallback(
        async (response: any) => {
            try {
                const { credential } = response;

                setIsLoggingIn(true);

                await dispatch(login(credential));
                await dispatch(getFavorites());

                if (callbackUrl) {
                    router.push(callbackUrl);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoggingIn(false);
            }
        },
        [dispatch, router, callbackUrl]
    );

    const renderGoogleSignInButton = useCallback(() => {
        if (window?.google && google) {
            google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: true
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
                google.accounts.id.prompt();
                return true;
            }
        }

        return false;
    }, [handleCredentialResponse]);

    useEffect(() => {
        let tryAgain: ReturnType<typeof setInterval>;
        let count = 0;

        tryAgain = setInterval(() => {
            const success = renderGoogleSignInButton();

            if (success) {
                clearInterval(tryAgain);
            } else {
                count += 1;
                if (count > 20) {
                    setFailedToLoad(true);
                    clearInterval(tryAgain);
                }
            }
        }, 250);

        return () => tryAgain && clearInterval(tryAgain);
    }, [momoizedShowLoginDialog, renderGoogleSignInButton]);

    const handleClose = (success: boolean) => {
        dispatch(resetLogin({ success }));
    };

    const handleRetry = () => {
        setFailedToLoad(false);

        renderGoogleSignInButton();
    };

    return (
        <Dialog open={showLoginDialog} maxWidth="xs" onClose={isLoggingIn ? undefined : () => handleClose(false)}>
            <DialogTitle>{isLoading ? 'Please wait' : 'To continue, please login with Google!'}</DialogTitle>
            <DialogContent dividers>
                {failedToLoad ? (
                    <>
                        <Typography component="p" color="warning.main" className="mt-2">
                            We are unable to load Google Sign-In.{' '}
                            <Typography
                                component="span"
                                onClick={handleRetry}
                                className='cursor-pointer underline underline-offset-2'
                                color="text.primary"
                            >
                                Retry now
                            </Typography>{' '}
                            or try again later.
                        </Typography>
                    </>
                ) : (
                    <>
                        {!isLoading && (
                            <>
                                <Typography variant="caption" color="warning.main" className="mt-2">
                                    If you don&apos;t have any Google account, you may need to create one first.
                                </Typography>
                            </>
                        )}
                        {isLoading && <Typography className="mt-2">We are setting up your account... 😊</Typography>}
                    </>
                )}
                <Box className="mt-3" sx={{ display: isLoading ? 'none' : 'block' }}>
                    <div id="google_btn" />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    size="small"
                    onClick={() => dispatch(cancelLoginRequest())}
                    sx={{ textTransform: 'none' }}
                    disabled={isLoggingIn}
                    startIcon={isLoggingIn ? <CircularProgress size={14} /> : undefined}
                >
                    {isLoggingIn ? 'Logging in...' : 'Cancel'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginMessageDialog;
