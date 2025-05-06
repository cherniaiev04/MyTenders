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
    axios.delete(`${URL}/providers/${id}`)
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
      axios.put(`${URL}/providers/${selectedProvider.id}`, providerDetails)
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
      axios.post(`${URL}/providers/add`, providerDetails)
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
    <Box sx={{ padding: 3 }}>
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
            variant="contained"
            color="secondary"
            onClick={handleAddProvider}
            size="small"
            fullWidth
            sx={{ height: '100%' }}
          >
            Додати постачальника
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSortChange('companyName')}
            size="small"
            fullWidth
            sx={{ height: '100%' }}
          >
            Сортувати за назвою компанії
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSortChange('name')}
            size="small"
            fullWidth
            sx={{ height: '100%' }}
          >
            Сортувати за ім'ям
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSortChange('surname')}
            size="small"
            fullWidth
            sx={{ height: '100%' }}
          >
            Сортувати за прізвищем
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Назва компанії</TableCell>
              <TableCell>Ім'я</TableCell>
              <TableCell>Прізвище</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProviders.map((provider) => (
              <TableRow
                key={provider.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {provider.companyName}
                </TableCell>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.surname}</TableCell>
                <TableCell>{provider.phone}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditProvider(provider)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Редагувати
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProvider(provider.id)}
                    size="small"
                  >
                    Видалити
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedProvider ? 'Редагувати постачальника' : 'Додати постачальника'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Назва компанії"
              name="companyName"
              value={providerDetails.companyName}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Ім'я"
              name="name"
              value={providerDetails.name}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Прізвище"
              name="surname"
              value={providerDetails.surname}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Телефон"
              name="phone"
              value={providerDetails.phone}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              name="email"
              value={providerDetails.email}
              onChange={handleChange}
              variant="outlined"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Скасувати
          </Button>
          <Button onClick={handleSave} color="primary">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProvidersList;
