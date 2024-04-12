import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';

type RequestLoginPayload = {
    authUrl: string;
    callbackUrl: string | null;
}

type AuthState = {
    loggedIn: boolean;
    showLoginDialog: boolean;
    authUrl: string;
    callbackUrl: string | null;
}

const initState: AuthState = {
    authUrl: '',
    loggedIn: false,
    showLoginDialog: false,
    callbackUrl: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        setLoggedInStatus: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        requestLogin: (state, action: PayloadAction<RequestLoginPayload>) => {
            state.showLoginDialog = true;
            state.authUrl = action.payload.authUrl;
            state.callbackUrl = action.payload.callbackUrl;
        },
        resetLogin: (state, action: PayloadAction<{ success: boolean }>) => {
            state.loggedIn = action.payload.success;
            state.showLoginDialog = false;
            state.authUrl = '';
            state.callbackUrl = null;
        },
        cancelLoginRequest: (state) => {
            state.showLoginDialog = false;
            state.authUrl = '';
            state.callbackUrl = null;
        }
    }
});

export const { requestLogin, resetLogin, setLoggedInStatus, cancelLoginRequest } = authSlice.actions;
export const selectLoggedInStatus = (state: AppState) => state.auth.loggedIn;
export const selectShowLoginDialog = (state: AppState) => state.auth.showLoginDialog;
export const selectCallbackUrl = (state: AppState) => state.auth.callbackUrl;
export const selectAuthUrl = (state: AppState) => state.auth.authUrl;

export default authSlice.reducer;
