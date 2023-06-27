import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/authSlice';

const EmptyRoute: React.FC = () => {
    const user = useAppSelector(selectUser);

    return user ? (
        <Navigate to="/" replace />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default EmptyRoute;
