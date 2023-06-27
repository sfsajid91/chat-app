import jwtDecode from 'jwt-decode';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { userLoggedIn } from '../features/auth/authSlice';
import type { User } from '../types/Types';

const GoogleOauth: React.FC = () => {
    const params = useParams();

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const getJwt = async () => {
        try {
            const userJwt = params.user as string;
            const decodedUser: User = jwtDecode(userJwt.split('+').join('.'));
            const accessToken = params.jwt as string;
            dispatch(userLoggedIn({ accessToken, user: decodedUser }));
            localStorage.setItem(
                'auth',
                JSON.stringify({
                    accessToken: accessToken.split('+').join('.'),
                    user: decodedUser,
                })
            );
        } catch (err) {
            navigate('/login', { replace: true });
        }
    };

    useEffect(() => {
        getJwt();
    }, []);

    return null;
};

export default GoogleOauth;
