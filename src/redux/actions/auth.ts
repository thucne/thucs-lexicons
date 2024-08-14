import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { reset, resetLogin } from '../reducers/auth';
import { clearFavoriteLexicons } from '../reducers/favoriteLexicons';
import { setAuthStatus } from '../reducers/authStatus';
import { AuthStatus } from '@/types';

type ReturnType = (dispatch: Dispatch) => Promise<void>;

const LOGIN_URL = '/api/auth/login/validate';
const HANDSHAKE_URL = '/api/auth/login/handshake';
const LOGOUT_URL = '/api/auth/logout';

class Auth {
    constructor() {}

    login(token: string): ReturnType {
        return async (dispatch: Dispatch) => {
            dispatch(setAuthStatus(AuthStatus.Handshaking));
            return await axios
                .post(LOGIN_URL, {
                    token
                })
                .then((response) => {
                    dispatch(resetLogin({ success: true, email: response.data.email } as any));
                })
                .catch((error) => {
                    console.error(error);
                    dispatch(resetLogin({ success: false } as any));
                })
                .finally(() => {
                    dispatch(setAuthStatus(AuthStatus.Handshaked));
                });
        };
    }

    handshake(): ReturnType {
        return async (dispatch: Dispatch) => {
            return axios
                .get(HANDSHAKE_URL, { withCredentials: true })
                .then((response) => {
                    if (response.data.result === 1) {
                        dispatch(resetLogin({ success: true, email: response.data.email } as any));
                    } else {
                        dispatch(resetLogin({ success: false } as any));
                    }
                })
                .catch((error) => {
                    console.error(error);
                    dispatch(resetLogin({ success: false } as any));
                });
        };
    }

    logout(): ReturnType {
        return async (dispatch: Dispatch) => {
            return axios
                .get(LOGOUT_URL, { withCredentials: true })
                .then((response) => {
                    if (response.data.result === 1) {
                        dispatch(reset());
                        dispatch(clearFavoriteLexicons());
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        };
    }
}

const login = new Auth();

const validateAndLogin = login.login;
const handshake = login.handshake;
const logout = login.logout;

export { validateAndLogin, handshake, logout };
