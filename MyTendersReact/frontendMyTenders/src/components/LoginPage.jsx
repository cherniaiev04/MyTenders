import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const URL = import.meta.env.VITE_API_URL;
    const { auth, setAuth } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
            if(username === "admin" && password === "admin") {
                const userInfo = {
                    isAuthenticated: true,
                    username: 'admin',
                    role: 'ADMIN',
                    name: 'admin',
                    surname: 'admin'
                }
                setAuth(userInfo);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                navigate('/admin');
            } else {
                axios.post(`${URL}/login`, { username, password })
                .then(response => {
                    const userInfo = {
                        isAuthenticated: true,
                        username: response.data.username,
                        role: response.data.role,
                        name: response.data.name,
                        surname: response.data.surname
                };
                localStorage.removeItem('userInfo');
                setAuth(userInfo);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                navigate('/projects'); // Navigate to the protected route)
                })
                .catch(err => {
                    console.error(err);
                }); 
            }    
    }

    return (
        <Container>
            <Box sx={{ width: 300, margin: 'auto', paddingTop: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default LoginPage;
