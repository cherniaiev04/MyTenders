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
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';


function MaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [filter, setFilter] = useState({
    name: '',
    type: ''
  });
  const [sort, setSort] = useState({
    field: '',
    direction: 'asc',
  });
  const [materialsForProject, setMaterialsForProject] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [newAmount, setNewAmount] = useState('');

  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const [materialsRes, materialsForProjectRes] = await Promise.all([
          axios.get(URL + '/materials', { withCredentials: true }),
          axios.get(URL + '/materials/forProjects', { withCredentials: true }),
        ]);

        setMaterials(materialsRes.data);
        setFilteredMaterials(materialsRes.data);

        const data = materialsForProjectRes.data;
        const materialsArray = Object.keys(data).map(key => ({
          id: key,
          amount: data[key],
        }));

        setMaterialsForProject(materialsArray);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchMaterials();
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
    let filtered = materials;

    if (filter.name) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter.type) {
      filtered = filtered.filter(material =>
        material.type.toLowerCase().includes(filter.type.toLowerCase())
      );
    }

    if (sort.field) {
      filtered = filtered.sort((a, b) => {
        if (sort.field === 'amount') {
          return (a.amount - b.amount) * (sort.direction === 'asc' ? 1 : -1);
        } else {
          return a[sort.field].localeCompare(b[sort.field]) * (sort.direction === 'asc' ? 1 : -1);
        }
      });
    }

    setFilteredMaterials(filtered);
  };

  const handleAddMaterial = () => {
    navigate('/materials/add');
  };

  const handleClickOpen = (material) => {
    setSelectedMaterial(material);
    setNewAmount(material.amount);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMaterial(null);
    setNewAmount('');
  };

  const handleGetHistory = (id) => {
    navigate(`/materials/${id}`);
  };

  const handleSave = () => {
    if (newAmount >= 0) {
      axios.put(`${URL}/materials/${selectedMaterial.id}`, { amount: newAmount }, { withCredentials: true })
        .then(res => {
          setMaterials(materials.map(material =>
            material.id === selectedMaterial.id ? { ...material, amount: newAmount } : material
          ));
          setFilteredMaterials(filteredMaterials.map(material =>
            material.id === selectedMaterial.id ? { ...material, amount: newAmount } : material
          ));
          handleClose();
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  const getUsedAmount = (materialId) => {
    const material = materialsForProject.find(m => m.id === String(materialId));
    return material ? material.amount : 0;
  };

  return (
    <Box sx={{ backgroundColor: '#f5f6f8', minHeight: '100vh', padding: 4 }}>
      <Paper elevation={1} sx={{ padding: 3, marginBottom: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <TextField
              label="Тип"
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              onClick={handleAddMaterial}
              size="small"
              fullWidth
              sx={{ height: '100%', textTransform: 'none', fontWeight: 500 }}
            >
              + Додати матеріал
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => handleSortChange('name')}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Сортувати за назвою
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleSortChange('amount')}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Сортувати за кількістю
          </Button>
        </Box>
      </Paper>

      <Paper elevation={1}>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Назва</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Тип</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Використовується</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Кількість</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Дії</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id} hover>
                  <TableCell>{material.name}</TableCell>
                  <TableCell align="right">{material.type}</TableCell>
                  <TableCell align="right">{getUsedAmount(material.id)}</TableCell>
                  <TableCell align="right">{material.amount}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleClickOpen(material)}
                      sx={{ textTransform: 'none' }}
                    >
                      Змінити кількість
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleGetHistory(material.id)}
                      sx={{ textTransform: 'none', ml: 1 }}
                    >
                      Історія
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Змінити кількість</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Нова кількість"
            type="number"
            fullWidth
            variant="outlined"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ paddingX: 3, paddingBottom: 2 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>Скасувати</Button>
          <Button onClick={handleSave} sx={{ textTransform: 'none' }}>Зберегти</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MaterialsList;
