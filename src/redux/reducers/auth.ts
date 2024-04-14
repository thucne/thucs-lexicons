import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { validateAndLogin } from '../actions/auth';

type RequestLoginPayload = {
    callbackUrl: string | null;
};

type AuthState = {
    loggedIn: boolean;
    showLoginDialog: boolean;
    callbackUrl: string | null;
};

const initState: AuthState = {
    loggedIn: false,
    showLoginDialog: false,
    callbackUrl: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        setLoggedInStatus: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        requestLogin: (state, action: PayloadAction<RequestLoginPayload>) => {
            state.showLoginDialog = true;
            state.callbackUrl = action.payload.callbackUrl;
        },
        resetLogin: (state, action: PayloadAction<{ success: boolean }>) => {
            state.loggedIn = action.payload.success;
            state.showLoginDialog = false;
            state.callbackUrl = null;
        },
        cancelLoginRequest: (state) => {
            state.showLoginDialog = false;
            state.callbackUrl = null;
        }
    }
});

export const { requestLogin, resetLogin, setLoggedInStatus, cancelLoginRequest } = authSlice.actions;
export const selectLoggedInStatus = (state: AppState) => state.auth.loggedIn;
export const selectShowLoginDialog = (state: AppState) => state.auth.showLoginDialog;
export const selectCallbackUrl = (state: AppState) => state.auth.callbackUrl;
export const login = validateAndLogin;

export default authSlice.reducer;
