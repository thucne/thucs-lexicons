'use client';

import { useState, useEffect } from 'react';

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

    useEffect(() => {
        let tryAgain: ReturnType<typeof setInterval>;
        let count = 0;

        if (window?.google && google) {
            const handleCredentialResponse = async (response: any) => {
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
            };

            tryAgain = setInterval(() => {
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
                    clearInterval(tryAgain);
                } else {
                    count += 1;

                    if (count > 20) {
                        setFailedToLoad(true);
                        clearInterval(tryAgain);
                    }
                }
            }, 250);
        }

        return () => tryAgain && clearInterval(tryAgain);
    }, [showLoginDialog, callbackUrl, router, dispatch]);

    const handleClose = (success: boolean) => {
        dispatch(resetLogin({ success }));
    };

    if (failedToLoad) {
        return (
            <Dialog open={showLoginDialog} onClose={() => handleClose(false)}>
                <DialogTitle>Failed to load Google Sign-In</DialogTitle>
                <DialogContent dividers>
                    <Typography color="error.main" className="mt-2">
                        We are unable to load Google Sign-In. Please try again later.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={() => handleClose(false)} sx={{ textTransform: 'none' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={showLoginDialog} maxWidth="xs" onClose={isLoggingIn ? undefined : () => handleClose(false)}>
            <DialogTitle>{isLoading ? 'Please wait' : 'To continue, please login with Google!'}</DialogTitle>
            <DialogContent dividers>
                {!isLoading && (
                    <>
                        <Typography variant="caption" color="warning.main" className="mt-2">
                            If you don&apos;t have any Google account, you may need to create one first.
                        </Typography>
                        <Box className="mt-3">
                            <div id="google_btn" />
                        </Box>
                    </>
                )}
                {isLoading && (
                    <Typography className="mt-2">We are setting up your account... 😊</Typography>
                )}
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
