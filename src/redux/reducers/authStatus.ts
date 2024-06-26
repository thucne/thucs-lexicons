import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { AuthStatus } from '@/types';

const initialState = AuthStatus.NotRun;

export const authStatusSlice = createSlice({
    name: 'authStatus',
    initialState,
    reducers: {
        setAuthStatus: (_, action: PayloadAction<AuthStatus>) => action.payload
    }
});

export const { setAuthStatus } = authStatusSlice.actions;
export const selectAuthStatus = (state: AppState) => state.authStatus;

export default authStatusSlice.reducer;
