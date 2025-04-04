import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';

function AddProject() {
  const [project, setProject] = useState({
    name: '',
    numberOfProject: '',
    date: '',
    additionalInformation: '',
    status: '',
    participate: false
  });

  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState('ACTIVE');
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleChangeStatus = (event, newAlignment) => {
    setAlignment(newAlignment);
    const {name, value} = event.target;
    setProject({...project, status: value});
  };

  const URL = import.meta.env.VITE_API_URL;


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(URL + '/projects/add', project)
      .then(res => {
        console.log(res.data);
        navigate('/projects')
        // Handle success (e.g., redirect to project list)
      })
      .catch(err => {
        console.error(err);
        // Handle error
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
          Додати новий проєкт
        </Typography>
        <TextField
          label="Назва"
          variant="filled"
          name="name"
          value={project.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Номер проєкту"
          variant="filled"
          name="numberOfProject"
          value={project.numberOfProject}
          onChange={handleChange}
          required
        />
        <TextField
          label="Дата"
          variant="filled"
          type="date"
          name="date"
          value={project.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Додаткова інформація"
          variant="filled"
          name="additionalInformation"
          multiline
          rows={7}
          value={project.additionalInformation}
          onChange={handleChange}
          required
        />
        <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChangeStatus}
        aria-label="Platform"
        >
            <ToggleButton value="ACTIVE">Активний</ToggleButton>
            <ToggleButton value="INACTIVE">Неактивний</ToggleButton>
            <ToggleButton value="COMPLETED">Зроблений</ToggleButton>
            <ToggleButton value="CANCELLED">Відміненний</ToggleButton>
        </ToggleButtonGroup>
        <FormControlLabel control={<Checkbox />} label="Приймаєтся участь?"/>
        <Button type="submit" variant="contained" color="primary">
          Додати
        </Button>
      </Box>
    </Container>
  );
}

export default AddProject;
