// src/components/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const FormContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});

const Login = () => {
    const { loginUser } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(username, password);
            navigate('/rooms');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <FormContainer>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ margin: '1.5rem 0 1rem' }}
                    >
                        Login
                    </Button>
                </form>
            </FormContainer>
        </Container>
    );
};

export default Login;
