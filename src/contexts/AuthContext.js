// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { login, logout, register } from '../api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const [user, setUser] = useState(() => 
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    );

    const loginUser = async (username, password) => {
        try {
            const response = await login(username, password);
            setAuthTokens(response.data);
            setUser({ username });
            localStorage.setItem('authTokens', JSON.stringify(response));
            localStorage.setItem('user', JSON.stringify({ username }));
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logoutUser = async () => {
        try {
            await logout();
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem('authTokens');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const registerUser = async (username, email, password) => {
        try {
            await register(username, email, password);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        registerUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
