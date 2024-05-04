import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { validateAndLogin, handshake as handshakeAction, logout as logoutAction } from '../actions/auth';
import axios from 'axios';
import { setAuthStatus } from './authStatus';
import { AuthStatus } from '@/types';

type RequestLoginPayload = {
    callbackUrl: string | null;
};

type AuthState = {
    loggedIn: boolean;
    showLoginDialog: boolean;
    callbackUrl: string | null;
    email: string | null;
};

const initState: AuthState = {
    loggedIn: false,
    showLoginDialog: false,
    callbackUrl: null,
    email: null
};

const LOGIN_URL = '/api/auth/login/validate';

export const loginV2 = createAsyncThunk('auth/validateAndLogin2', async (token: string, { dispatch }) => {
    dispatch(setAuthStatus(AuthStatus.Handshaking));
    const response = await axios.post(LOGIN_URL, { token }).finally(() => {
        dispatch(setAuthStatus(AuthStatus.Handshaked));
    });
    return response.data;
});

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
        resetLogin: (state: AuthState, action?: PayloadAction<{ success: boolean; email?: string }>) => {
            state.loggedIn = action?.payload?.success || false;
            state.showLoginDialog = false;
            state.callbackUrl = null;
            state.email = action?.payload?.email || null;
        },
        cancelLoginRequest: (state) => {
            state.showLoginDialog = false;
            state.callbackUrl = null;
        },
        reset: () => initState
    },
    extraReducers: (builder) => {
        builder.addCase(loginV2.pending, () => {});
        builder.addCase(loginV2.fulfilled, (state, action) => {
            state.loggedIn = true;
            state.showLoginDialog = false;
            state.callbackUrl = null;
            state.email = action?.payload?.email || null;
        });
        builder.addCase(loginV2.rejected, (state) => {
            state.loggedIn = false;
            state.showLoginDialog = false;
            state.callbackUrl = null;
            state.email = null;
        });
    }
});

export const { requestLogin, resetLogin, setLoggedInStatus, cancelLoginRequest, reset } = authSlice.actions;
export const selectLoggedInStatus = (state: AppState) => state.auth.loggedIn;
export const selectShowLoginDialog = (state: AppState) => state.auth.showLoginDialog;
export const selectCallbackUrl = (state: AppState) => state.auth.callbackUrl;
export const selectEmail = (state: AppState) => state.auth.email;
export const login = validateAndLogin;
export const handshake = handshakeAction;
export const logout = logoutAction;

export default authSlice.reducer;
