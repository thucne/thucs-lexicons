import { Logger } from '@/types/decorators';
import { Dispatch } from '@reduxjs/toolkit';
import axios from 'axios';
import { resetLogin } from '../reducers/auth';

type ReturnType = (dispatch: Dispatch) => Promise<void>;

const LOGIN_URL = '/api/auth/login/validate';
const LOG_PREFIX = 'Auth';

class Login {
    constructor() {}

    @Logger(LOG_PREFIX)
    login(token: string): ReturnType {
        return async (dispatch: Dispatch) => {
            return axios
                .post(LOGIN_URL, {
                    token
                })
                .then((_) => {
                    dispatch(resetLogin({ success: true }));
                })
                .catch((error) => {
                    console.error(error);
                    dispatch(resetLogin({ success: false }));
                });
        };
    }
}

const login = new Login();

const validateAndLogin = login.login;

export { validateAndLogin };
