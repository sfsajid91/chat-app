import type { User } from '../../types/Types';
import apiSlice from '../api/apiSlice';
import { socket } from '../chat/chatApi';
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

                    socket.connect();
                } catch (err) {
                    // do nothing
                }
            },
        }),

        updateName: builder.mutation<User, string>({
            query: (name) => ({
                url: '/profile/name',
                method: 'PATCH',
                body: { name },
            }),

            async onQueryStarted(_arg, { queryFulfilled, dispatch, getState }) {
                try {
                    const result = await queryFulfilled;
                    const user = result.data as User;

                    const accessToken = getState().auth.accessToken;

                    dispatch(userLoggedIn({ user, accessToken }));

                    localStorage.setItem(
                        'auth',
                        JSON.stringify({ accessToken, user })
                    );
                } catch (err) {
                    // do nothing
                }
            },
        }),

        updatePassword: builder.mutation({
            query: (body) => ({
                url: '/profile/password',
                method: 'PATCH',
                body: body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useUpdateNameMutation,
    useUpdatePasswordMutation,
} = authApi;
