import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, MenuItem, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function AddUser() {
  const [user, setUser] = useState({
    username: '',
    password: '',
    name: '',
    surname: '',
    position: '',
    role: 'STAFF'
  });
  const { auth, setAuth } = useAuth();
  const URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${URL}/admin/addUser`, user)
      .then(res => {
        console.log('User added:', res.data);
        // Handle success (e.g., show a success message or redirect)
      })
      .catch(err => {
        console.error(err);
        // Handle error (e.g., show an error message)
      });
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      username: '',
      role: '',
      name: '',
      surname: '',
      token: ''
    });
    localStorage.removeItem('userInfo');
  };

  const roleMapping = {
    DIRECTOR: 'Директор',
    MANAGER: 'Менеджер',
    STAFF: 'Робочий персонал'
  };

  return (
    <Container>
      <Box sx={{ padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Додати нового користувача
          </Typography>
          <form onSubmit={handleSubmit}>
          <TextField
              label="Ім'я"
              variant="outlined"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Прізвище"
              variant="outlined"
              name="surname"
              value={user.surname}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Ім'я користувача"
              variant="outlined"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Пароль"
              variant="outlined"
              name="password"
              type="password"
              value={user.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Посада"
              variant="outlined"
              name="position"
              value={user.position}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Роль"
              variant="outlined"
              name="role"
              value={user.role}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              select
              required
            >
              {Object.keys(roleMapping).map(key => (
                <MenuItem key={key} value={key}>
                  {roleMapping[key]}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Додати
            </Button>
          </form>
        </Paper>
        <Button variant="contained" color="error" onClick={handleLogout}>
              Вийти
        </Button>
      </Box>
    </Container>
  );
}

export default AddUser;
