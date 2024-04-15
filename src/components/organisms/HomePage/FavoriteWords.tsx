import Link from 'next/link';

import Grid from '@/components/atoms/AppGrid';
import { Chip, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearFavorites, selectFavoriteLexicons } from '@/redux/reducers/favoriteLexicons';
import { logout, requestLogin, selectEmail, selectLoggedInStatus } from '@/redux/reducers/auth';
import { selectAuthStatus } from '@/redux/reducers/authStatus';
import { AuthStatus } from '@/hooks/use-init';

const FavoriteWords = () => {
    const dispatch = useAppDispatch();
    const favoriteLexicons = useAppSelector(selectFavoriteLexicons) as string[];
    const loggedIn = useAppSelector(selectLoggedInStatus);
    const email = useAppSelector(selectEmail);
    const authStatus = useAppSelector(selectAuthStatus);

    const handleRequestLogin = () => {
        dispatch(requestLogin({ callbackUrl: '/' }));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    if ([AuthStatus.NotRun, AuthStatus.Handshaking].includes(authStatus)) {
        return <Typography variant="body2">Loading...</Typography>;
    }

    if ([AuthStatus.Handshaked, AuthStatus.Loaded].includes(authStatus) && !loggedIn) {
        return (
            <Typography variant="body2">
                Please login to see your favorite lexicons.{' '}
                <Typography
                    variant="body2"
                    component="span"
                    onClick={handleRequestLogin}
                    className="cursor-pointer italic underline underline-offset-4"
                >
                    Click to login.
                </Typography>
            </Typography>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Typography variant="h6" component="h2">
                    Favorite Words
                    <br />
                    <Typography variant="body2" color="success.main">
                        Logged in as {email}.{' '}
                        {[AuthStatus.Handshaked, AuthStatus.Loading].includes(authStatus) && loggedIn ? (
                            <Typography variant="body2" component="span" color="text.primary">
                                Loading your favorite lexicon...
                            </Typography>
                        ) : (
                            <Typography
                                variant="body2"
                                component="span"
                                className="cursor-pointer italic underline underline-offset-4"
                                onClick={handleLogout}
                                color="text.primary"
                            >
                                Logout.
                            </Typography>
                        )}
                    </Typography>
                </Typography>
            </Grid>
            {authStatus === AuthStatus.Loaded && <FavoriteWordsList favoriteLexicons={favoriteLexicons} />}
        </Grid>
    );
};

const FavoriteWordsList = ({ favoriteLexicons }: { favoriteLexicons: string[] }) => {
    const dispatch = useAppDispatch();

    const handleClearFavorites = () => {
        dispatch(clearFavorites());
    };

    return (
        <>
            {favoriteLexicons?.length > 0 && (
                <Grid xs={12}>
                    <Typography className="cursor-pointer underline underline-offset-2" onClick={handleClearFavorites}>
                        Clear all
                    </Typography>
                </Grid>
            )}
            {favoriteLexicons?.length > 0 ? (
                favoriteLexicons.map((word, index) => (
                    <Grid key={index}>
                        <Chip label={word} component={Link} href={`/search/${word}`} clickable />
                    </Grid>
                ))
            ) : (
                <Grid xs={12}>
                    <Typography variant="body2">You have no favorite lexicons.</Typography>
                </Grid>
            )}
        </>
    );
};

export default FavoriteWords;
