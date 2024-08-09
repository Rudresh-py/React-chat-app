// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import Rooms from './components/Rooms';
import Messages from './components/Messages';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <ChatProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/rooms" element={<PrivateRoute element={<Rooms />} />} />
                        <Route path="/messages/:roomSlug" element={<PrivateRoute element={<Messages />} />} />
                    </Routes>
                </ChatProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
