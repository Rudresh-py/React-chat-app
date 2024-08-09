// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthToken = () => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens).access : null;
};

const apiClient = axios.create({
    baseURL: API_URL,
});

apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

apiClient.interceptors.response.use(response => response, async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const response = await axios.post(`${API_URL}/token/refresh/`, {
                refresh: JSON.parse(localStorage.getItem('authTokens')).refresh
            });
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            apiClient.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
        }
    }
    return Promise.reject(error);
});

export const fetchRooms = async () => {
    try {
        const response = await apiClient.get('/rooms/');
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return { status: 'error', message: 'Unable to fetch rooms' };
    }
};

export const fetchMessages = async (roomSlug) => {
    try {
        const response = await apiClient.get(`/rooms/${roomSlug}/messages/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return { status: 'error', message: 'Unable to fetch messages' };
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/token/`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        return { status: 'error', message: 'Unable to login' };
    }
};

export const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register/`, { username, email, password });
        return response.data;
    } catch (error) {
        console.error('Error registering:', error);
        return { status: 'error', message: 'Unable to register' };
    }
};

export const logout = async () => {
    try {
        const response = await apiClient.post('/logout/', { refresh: JSON.parse(localStorage.getItem('authTokens')).refresh });
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        return { status: 'error', message: 'Unable to logout' };
    }
};

export const createRoom = async (name, slug) => {
    try {
        const response = await apiClient.post('/rooms/create/', { name, slug });
        return response.data;
    } catch (error) {
        console.error('Error creating room:', error);
        return { status: 'error', message: 'Unable to create room' };
    }
};
