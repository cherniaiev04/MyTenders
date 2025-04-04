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
          axios.get(URL + '/materials'),
          axios.get(URL + '/materials/forProjects'),
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
    if(newAmount >= 0) {
      axios.put(`${URL}/materials/${selectedMaterial.id}`, { amount: newAmount })
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
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
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
        <Grid item xs={4}>
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
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddMaterial}
            size="small"
            fullWidth
          >
            Додати матеріал
          </Button>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={() => handleSortChange('name')} size="small" sx={{ mt: 2, mr: 1 }}>
        Сортувати за назвою
      </Button>
      <Button variant="contained" color="primary" onClick={() => handleSortChange('amount')} size="small" sx={{ mt: 2 }}>
        Сортувати за кількістю
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Назва</TableCell>
              <TableCell align="right">Тип</TableCell>
              <TableCell align="right">Використовується</TableCell>
              <TableCell align="right">Кількість</TableCell>
              <TableCell align="center">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow
                key={material.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {material.name}
                </TableCell>
                <TableCell align="right">{material.type}</TableCell>
                <TableCell align="right">{getUsedAmount(material.id)}</TableCell>
                <TableCell align="right">{material.amount}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(material)} size="small">
                    Змінити кількість
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleGetHistory(material.id)} size="small" sx={{ ml: 1 }}>
                    Історія
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Змінити кількість</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Нова кількість"
            type="number"
            fullWidth
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
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
    </div>
  );
}

export default MaterialsList;
