import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';

function MaterialView() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [usedAmount, setUsedAmount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({ providerId: '', quantity: '', price: '', date: '', addToTotal: false });
  const [providers, setProviders] = useState([]);
  const [isNewProvider, setIsNewProvider] = useState(false);
  const [newProvider, setNewProvider] = useState({ companyName: '', name: '', surname: '', phone: '', email: '' });

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const [materialRes, orderHistoryRes, usedAmountRes, providersRes] = await Promise.all([
          axios.get(`${URL}/materials/${id}`, { withCredentials: true }),
          axios.get(`${URL}/materials/${id}/orders`, { withCredentials: true }),
          axios.get(`${URL}/materials/${id}/usedAmount`, { withCredentials: true }),
          axios.get(`${URL}/providers`, { withCredentials: true }), // Fetch all providers
        ]);

        setMaterial(materialRes.data);
        setOrderHistory(orderHistoryRes.data);
        setUsedAmount(usedAmountRes.data);
        setProviders(providersRes.data);
      } catch (error) {
        console.error('Error fetching material data:', error);
      }
    };

    fetchMaterialData();
  }, [id, URL]);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (isNewProvider) {
      setNewProvider({ ...newProvider, [name]: value });
    } else {
      setNewOrder({ ...newOrder, [name]: value });
    }
  };

  const handleCheckboxChange = (event) => {
    setNewOrder({ ...newOrder, addToTotal: event.target.checked });
  };

  const handleNewOrderSubmit = async () => {
    try {
      let providerId = newOrder.providerId;
      if (isNewProvider) {
        const newProviderRes = await axios.post(`${URL}/providers/add`, newProvider, { withCredentials: true });
        providerId = newProviderRes.data.id;
      }

      const orderData = {
        providerId,
        quantity: newOrder.quantity,
        price: newOrder.price,
        date: newOrder.date
      };

      await axios.post(`${URL}/materials/${id}/addOrder`, orderData, {
        params: { addToTotal: newOrder.addToTotal },
        withCredentials: true,
      });

      // Fetch updated order history and material data
      const [orderHistoryRes, materialRes] = await Promise.all([
        axios.get(`${URL}/materials/${id}/orders`, { withCredentials: true }),
        axios.get(`${URL}/materials/${id}`, { withCredentials: true }),
      ]);

      setOrderHistory(orderHistoryRes.data);
      setMaterial(materialRes.data);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error adding new order:', error);
    }
  };

  if (!material) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Інформація про матеріал
          </Typography>
          <Typography variant="h6">Назва: {material.name}</Typography>
          <Typography variant="h6">Тип: {material.type}</Typography>
          <Typography variant="h6">Використовується: {usedAmount}</Typography>
          <Typography variant="h6">Залишилось: {material.amount}</Typography>

          <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ marginTop: 2 }}>
            Додати нове замовлення
          </Button>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Додати нове замовлення</DialogTitle>
            <DialogContent>
              <Autocomplete
                options={providers}
                getOptionLabel={(option) => option.companyName}
                onChange={(event, value) => setNewOrder({ ...newOrder, providerId: value ? value.id : '' })}
                renderInput={(params) => <TextField {...params} label="Постачальник" variant="outlined" margin="normal" fullWidth />}
                disabled={isNewProvider}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isNewProvider}
                    onChange={(event) => setIsNewProvider(event.target.checked)}
                  />
                }
                label="Нова компанія"
              />
              {isNewProvider && (
                <>
                  <TextField
                    label="Назва компанії"
                    variant="outlined"
                    name="companyName"
                    value={newProvider.companyName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Ім'я"
                    variant="outlined"
                    name="name"
                    value={newProvider.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Прізвище"
                    variant="outlined"
                    name="surname"
                    value={newProvider.surname}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Телефон"
                    variant="outlined"
                    name="phone"
                    value={newProvider.phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={newProvider.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
              <TextField
                label="Кількість"
                variant="outlined"
                name="quantity"
                value={newOrder.quantity}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Ціна"
                variant="outlined"
                name="price"
                value={newOrder.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Дата"
                variant="outlined"
                name="date"
                type="date"
                value={newOrder.date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newOrder.addToTotal}
                    onChange={handleCheckboxChange}
                    name="addToTotal"
                  />
                }
                label="Додати кількість у замовленні до загальної кількость"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Скасувати
              </Button>
              <Button onClick={handleNewOrderSubmit} color="primary">
                Додати
              </Button>
            </DialogActions>
          </Dialog>

          <Typography variant="h5" gutterBottom sx={{ marginTop: 3 }}>
            Історія замовлень
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="order history table">
              <TableHead>
                <TableRow>
                  <TableCell>Постачальник</TableCell>
                  <TableCell align="right">Кількість</TableCell>
                  <TableCell align="right">Ціна</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderHistory.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell component="th" scope="row">
                      {order.provider.companyName}
                    </TableCell>
                    <TableCell align="right">{order.amount}</TableCell>
                    <TableCell align="right">{order.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}

export default MaterialView;
