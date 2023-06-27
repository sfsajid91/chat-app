import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { User } from '../../types/Types';

interface AuthState {
    accessToken: string | null;
    user: User | null;
}

const initialState: AuthState = {
    accessToken: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (
            state,
            action: PayloadAction<{
                accessToken: string;
                user: AuthState['user'];
            }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLoggedOut: (state) => {
            state.accessToken = null;
            state.user = null;
        },
    },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;

export type AuthSliceState = ReturnType<typeof authSlice.reducer>;

export default authSlice.reducer;
