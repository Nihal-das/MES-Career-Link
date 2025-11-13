import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    } catch (error) {
        return true;
    }
};

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;