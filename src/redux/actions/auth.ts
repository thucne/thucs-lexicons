import { Logger } from '@/types/decorators';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { reset, resetLogin } from '../reducers/auth';
import { clearFavoriteLexicons } from '../reducers/favoriteLexicons';

type ReturnType = (dispatch: Dispatch) => Promise<void>;

const LOGIN_URL = '/api/auth/login/validate';
const HANDSHAKE_URL = '/api/auth/login/handshake';
const LOGOUT_URL = '/api/auth/logout';
const LOG_PREFIX = 'Auth';

class Auth {
    constructor() {}

    login(token: string): ReturnType {
        return async (dispatch: Dispatch) => {
            return axios
                .post(LOGIN_URL, {
                    token
                })
                .then((response) => {
                    dispatch(resetLogin({ success: true, email: response.data.email }));
                })
                .catch((error) => {
                    console.error(error);
                    dispatch(resetLogin({ success: false }));
                });
        };
    }

    handshake(): ReturnType {
        return async (dispatch: Dispatch) => {
            return axios
                .get(HANDSHAKE_URL, { withCredentials: true })
                .then((response) => {
                    if (response.data.result === 1) {
                        dispatch(resetLogin({ success: true, email: response.data.email }));
                    } else {
                        dispatch(resetLogin({ success: false }));
                    }
                })
                .catch((error) => {
                    console.error(error);
                    dispatch(resetLogin({ success: false }));
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
