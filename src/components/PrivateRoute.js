// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
    const { user } = useContext(AuthContext);

    return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
