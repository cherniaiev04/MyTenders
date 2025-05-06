import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AddMaterial() {
  const [material, setMaterial] = useState({
    name: '',
    type: '',
    amount: ''
  });

  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${URL}/materials/add`, material, { withCredentials: true })
      .then(res => {
        console.log('Material added:', res.data);
        // Redirect to materials list page or show a success message
        navigate('/materials');
      })
      .catch(err => {
        console.error('Error adding material:', err);
        // Show an error message
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          '& .MuiTextField-root': { my: 1 },
        }}
      >
        <Typography variant="h4" gutterBottom>
          Додати новий матеріал
        </Typography>
        <TextField
          label="Назва"
          variant="outlined"
          name="name"
          value={material.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Тип"
          variant="outlined"
          name="type"
          value={material.type}
          onChange={handleChange}
          required
        />
        <TextField
          label="Кількість"
          variant="outlined"
          name="amount"
          type="number"
          value={material.amount}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Додати
        </Button>
      </Box>
    </Container>
  );
}

export default AddMaterial;
