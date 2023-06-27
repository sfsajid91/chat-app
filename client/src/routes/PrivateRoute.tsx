import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/authSlice';

const PrivateRoute: React.FC = () => {
    const user = useAppSelector(selectUser);

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
