import apiSlice from '../api/apiSlice';
import { userLoggedIn } from './authSlice';

type RegisterCredentials = {
    name: string;
    email: string;
    password: string;
};

type LoginCredentials = {
    email: string;
    password: string;
};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials: RegisterCredentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation({
            query: (credentials: LoginCredentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),

            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    const { accessToken, user } = result.data;
                    dispatch(
                        userLoggedIn({
                            accessToken,
                            user,
                        })
                    );

                    localStorage.setItem(
                        'auth',
                        JSON.stringify({ accessToken, user })
                    );
                } catch (err) {
                    // do nothing
                }
            },
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
