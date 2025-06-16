import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${URL}/materials/deleteOrder/${orderId}`, { withCredentials: true });
      setOrderHistory((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
      // Здесь можно добавить уведомление об ошибке для пользователя
    }
  };

  if (!material) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container sx={{ backgroundColor: '#f5f6f8', minHeight: '100vh', paddingY: 4 }}>
      <Box sx={{ padding: { xs: 2, md: 4 } }}>
        <Paper elevation={1} sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Інформація про матеріал
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Назва: {material.name}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Тип: {material.type}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Використовується: {usedAmount}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>
            Залишилось: {material.amount}
          </Typography>

          <Button
            variant="outlined"
            onClick={handleDialogOpen}
            sx={{ marginBottom: 3, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Додати нове замовлення
          </Button>

          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            PaperProps={{
              sx: { borderRadius: 3, padding: 3, minWidth: { xs: '90%', sm: 450 } },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 2 }}>
              Додати нове замовлення
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 0 }}>
              <Autocomplete
                options={providers}
                getOptionLabel={(option) => option.companyName}
                onChange={(event, value) => setNewOrder({ ...newOrder, providerId: value ? value.id : '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Постачальник"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    size="small"
                    disabled={isNewProvider}
                  />
                )}
              />
              <FormControlLabel
                control={
                  <Checkbox checked={isNewProvider} onChange={(e) => setIsNewProvider(e.target.checked)} />
                }
                label="Нова компанія"
                sx={{ mt: 1 }}
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
                    size="small"
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
                    size="small"
                  />
                  <TextField
                    label="Прізвище"
                    variant="outlined"
                    name="surname"
                    value={newProvider.surname}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Телефон"
                    variant="outlined"
                    name="phone"
                    value={newProvider.phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={newProvider.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    size="small"
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
                size="small"
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
                size="small"
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
                size="small"
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
                label="Додати кількість у замовленні до загальної кількість"
                sx={{ mt: 1 }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleDialogClose}
                sx={{
                  textTransform: 'none',
                  color: '#5A5A5A',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#f0f0f0' },
                }}
              >
                Скасувати
              </Button>
              <Button
                onClick={handleNewOrderSubmit}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: '#0a6ed1',
                  '&:hover': { backgroundColor: '#095bb5' },
                }}
              >
                Додати
              </Button>
            </DialogActions>
          </Dialog>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
            Історія замовлень
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="order history table">
              <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Постачальник</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Кількість
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Ціна
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Дії
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderHistory.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell component="th" scope="row">{order.provider.companyName}</TableCell>
                    <TableCell align="right">{order.amount}</TableCell>
                    <TableCell align="right">{order.price}</TableCell>
                    <TableCell align="right">
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteOrder(order.id)}
                        sx={{ textTransform: 'none' }}
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
      </Box>
    </Container>
  );
}

export default MaterialView;
