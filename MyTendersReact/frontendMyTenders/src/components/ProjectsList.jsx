import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useAuth } from '../context/AuthContext';

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
}


function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState({
    name: '',
    numberOfProject: '',
    status: '',
  });
  const [sort, setSort] = useState({
    field: '',
    direction: 'asc',
  });

  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const [username, setUsername] = useState(auth.username);
  useEffect(() => {
    axios.get(`${URL}/projects`, {
      withCredentials: true,
    })
      .then(res => {
        setProjects(res.data);
        setFilteredProjects(res.data);
      })
      .catch(err => {
        console.error(err);
      });
    setUsername(auth.username);
  }, []);

  useEffect(() => {
    applyFilterAndSort();
  }, [filter, sort, projects]);

  const statusMapping = {
    ACTIVE: 'Активний',
    INACTIVE: 'Неактивний',
    COMPLETED: 'Зроблений',
    CANCELLED: 'Відмінений'
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSortChange = (field) => {
    const isAsc = sort.field === field && sort.direction === 'asc';
    setSort({ field, direction: isAsc ? 'desc' : 'asc' });
  };

  const applyFilterAndSort = () => {
    let filtered = [...projects];

    if (filter.name) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.numberOfProject) {
      filtered = filtered.filter(project =>
        project.numberOfProject.toLowerCase().includes(filter.numberOfProject.toLowerCase())
      );
    }

    if (filter.status) {
      filtered = filtered.filter(project =>
        project.status === filter.status
      );
    }

    if (sort.field) {
      filtered = filtered.sort((a, b) => {
        if (sort.field === 'date') {
          return (new Date(a.date) - new Date(b.date)) * (sort.direction === 'asc' ? 1 : -1);
        } else {
          return a[sort.field].localeCompare(b[sort.field]) * (sort.direction === 'asc' ? 1 : -1);
        }
      });
    }

    setFilteredProjects(filtered);
  };

  const handleAddProject = () => {
    navigate('/projects/add');
  };

  const handleGetProject = (id) => {
    navigate(`/projects/${id}`);
  }


  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f6f8', minHeight: '100vh' }}>
      <Paper elevation={1} sx={{ padding: 3, marginBottom: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Назва"
              name="name"
              value={filter.name}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Номер проєкту"
              name="numberOfProject"
              value={filter.numberOfProject}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel id="status-label">Статус</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                label="Статус"
              >
                <MenuItem value=""><em>Всі</em></MenuItem>
                {Object.keys(statusMapping).map(key => (
                  <MenuItem key={key} value={key}>{statusMapping[key]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {(auth.role === 'DIRECTOR' || auth.role === 'MANAGER') && (
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                onClick={handleAddProject}
                fullWidth
                sx={{
                  height: '100%',
                  fontWeight: 500,
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                + Додати тендер
              </Button>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              onClick={() => handleSortChange('name')}
              fullWidth
              sx={{ height: '100%', borderRadius: '8px' }}
            >
              Сортувати за назвою
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              onClick={() => handleSortChange('date')}
              fullWidth
              sx={{ height: '100%', borderRadius: '8px' }}
            >
              Сортувати за датою
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Назва</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Номер на сайті</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Дата подачі</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredProjects) && filteredProjects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>{project.name}</TableCell>
                  <TableCell align="right">{project.numberOfProject}</TableCell>
                  <TableCell align="right">{statusMapping[project.status] || project.status}</TableCell>
                  <TableCell align="right">{formatDate(project.date)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="text"
                      onClick={() => handleGetProject(project.id)}
                      sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                    >
                      Більше інформації
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default ProjectsList;
