import { useEffect, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { userLoggedIn } from '../features/auth/authSlice';

const useAuthCheck = () => {
    const dispatch = useAppDispatch();
    const [authChecked, setAuthChecked] = useState<boolean>(false);

    useEffect(() => {
        const localAuth = localStorage.getItem('auth');

        if (localAuth) {
            const auth = JSON.parse(localAuth);
            dispatch(userLoggedIn(auth));
        }

        setAuthChecked(true);
    }, [dispatch]);

    return authChecked;
};

export default useAuthCheck;
