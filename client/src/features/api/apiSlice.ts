import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedOut } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // add auth header here with type declaration
    prepareHeaders: (headers) => {
        // const token = (getState() as RootState).auth.accessToken;
        const auth = localStorage.getItem('auth')
            ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              JSON.parse(localStorage.getItem('auth')!)
            : null;
        if (auth?.accessToken) {
            headers.set('authorization', `Bearer ${auth?.accessToken}`);
        }
        return headers;
    },
});

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: async (args, api, extraOptions) => {
        const result = await baseQuery(args, api, extraOptions);

        if (result?.error?.status === 401) {
            api.dispatch(userLoggedOut());
            localStorage.clear();
            api.dispatch(apiSlice.util.resetApiState());
        }
        return result;
    },
    endpoints: () => ({}),
});

export default apiSlice;
