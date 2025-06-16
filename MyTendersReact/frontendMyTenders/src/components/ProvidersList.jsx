import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [filter, setFilter] = useState({
    companyName: '',
    name: '',
    surname: ''
  });
  const [sort, setSort] = useState({
    field: '',
    direction: 'asc',
  });
  const [open, setOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerDetails, setProviderDetails] = useState({
    companyName: '',
    name: '',
    surname: '',
    phone: '',
    email: ''
  });

  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(URL + '/providers', { withCredentials: true })
      .then(res => {
        setProviders(res.data);
        setFilteredProviders(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [URL]);

  useEffect(() => {
    applyFilterAndSort();
  }, [filter, sort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSortChange = (field) => {
    const isAsc = sort.field === field && sort.direction === 'asc';
    setSort({ field, direction: isAsc ? 'desc' : 'asc' });
  };

  const applyFilterAndSort = () => {
    let filtered = providers;

    if (filter.companyName) {
      filtered = filtered.filter(provider =>
        provider.companyName.toLowerCase().includes(filter.companyName.toLowerCase())
      );
    }

    if (filter.name) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.surname) {
      filtered = filtered.filter(provider =>
        provider.surname.toLowerCase().includes(filter.surname.toLowerCase())
      );
    }

    if (sort.field) {
      filtered = filtered.sort((a, b) => {
        if (sort.field === 'companyName' || sort.field === 'name' || sort.field === 'surname') {
          return a[sort.field].localeCompare(b[sort.field]) * (sort.direction === 'asc' ? 1 : -1);
        }
        return 0; // Add this line to prevent a return statement error
      });
    }

    setFilteredProviders(filtered);
  };

  const handleAddProvider = () => {
    setSelectedProvider(null);
    setProviderDetails({
      companyName: '',
      name: '',
      surname: '',
      phone: '',
      email: ''
    });
    setOpen(true);
  };

  const handleEditProvider = (provider) => {
    setSelectedProvider(provider);
    setProviderDetails({
      companyName: provider.companyName,
      name: provider.name,
      surname: provider.surname,
      phone: provider.phone,
      email: provider.email
    });
    setOpen(true);
  };

  const handleDeleteProvider = (id) => {
    axios.delete(`${URL}/providers/${id}`, { withCredentials: true })
      .then(res => {
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      })
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedProvider(null);
  };

  const handleSave = () => {
    if (selectedProvider) {
      axios.put(`${URL}/providers/${selectedProvider.id}`, providerDetails, { withCredentials: true })
        .then(res => {
          setProviders(providers.map(provider =>
            provider.id === selectedProvider.id ? res.data : provider
          ));
          setFilteredProviders(filteredProviders.map(provider =>
            provider.id === selectedProvider.id ? res.data : provider
          ));
          handleClose();
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      axios.post(`${URL}/providers/add`, providerDetails, { withCredentials: true })
        .then(res => {
          setProviders([...providers, res.data]);
          setFilteredProviders([...filteredProviders, res.data]);
          handleClose();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProviderDetails({ ...providerDetails, [name]: value });
  };

  return (
    <Box sx={{ backgroundColor: '#f5f6f8', minHeight: '100vh', padding: 4 }}>
      <Paper elevation={1} sx={{ padding: 3, marginBottom: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Назва компанії"
              name="companyName"
              value={filter.companyName}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Ім'я"
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
              label="Прізвище"
              name="surname"
              value={filter.surname}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={handleAddProvider}
              size="small"
              fullWidth
              sx={{ height: '100%', fontWeight: 500, textTransform: 'none', borderRadius: '8px' }}
            >
              + Додати постачальника
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              onClick={() => handleSortChange('companyName')}
              size="small"
              fullWidth
              sx={{ height: '100%', textTransform: 'none', borderRadius: '8px' }}
            >
              Сортувати за назвою компанії
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              onClick={() => handleSortChange('name')}
              size="small"
              fullWidth
              sx={{ height: '100%', textTransform: 'none', borderRadius: '8px' }}
            >
              Сортувати за ім'ям
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              onClick={() => handleSortChange('surname')}
              size="small"
              fullWidth
              sx={{ height: '100%', textTransform: 'none', borderRadius: '8px' }}
            >
              Сортувати за прізвищем
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Назва компанії</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ім'я</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Прізвище</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Телефон</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id} hover>
                  <TableCell component="th" scope="row">{provider.companyName}</TableCell>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.surname}</TableCell>
                  <TableCell>{provider.phone}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => handleEditProvider(provider)}
                      sx={{ textTransform: 'none' }}
                    >
                      Редагувати
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteProvider(provider.id)}
                      sx={{ textTransform: 'none', ml: 1 }}
                    >
                      Видалити
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 3,
            minWidth: { xs: '90%', sm: 400 },
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: '700', fontSize: '1.25rem', mb: 2 }}>
          {selectedProvider ? 'Редагувати постачальника' : 'Додати постачальника'}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 0 }}>
          <FormControl fullWidth margin="normal" sx={{ mt: 1 }}>
            <TextField
              label="Назва компанії"
              name="companyName"
              value={providerDetails.companyName}
              onChange={handleChange}
              variant="outlined"
              required
              sx={{ '& .MuiInputBase-input': { py: 1.5 } }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Ім'я"
              name="name"
              value={providerDetails.name}
              onChange={handleChange}
              variant="outlined"
              sx={{ '& .MuiInputBase-input': { py: 1.5 } }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Прізвище"
              name="surname"
              value={providerDetails.surname}
              onChange={handleChange}
              variant="outlined"
              sx={{ '& .MuiInputBase-input': { py: 1.5 } }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Телефон"
              name="phone"
              value={providerDetails.phone}
              onChange={handleChange}
              variant="outlined"
              sx={{ '& .MuiInputBase-input': { py: 1.5 } }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              name="email"
              value={providerDetails.email}
              onChange={handleChange}
              variant="outlined"
              sx={{ '& .MuiInputBase-input': { py: 1.5 } }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              color: '#5A5A5A',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#f0f0f0' }
            }}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#0a6ed1',
              '&:hover': { backgroundColor: '#095bb5' }
            }}
          >
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProvidersList;
