import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Divider, List, ListItem, ListItemText,
  Box, Paper, TextField, Button, IconButton, Grid
} from '@mui/material';
import { useAutocomplete } from '@mui/base/useAutocomplete';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const Root = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,.85)'};
  font-size: 14px;
`,
);

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(
  ({ theme }) => `
  width: 300px;
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#fff' : '#fff'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#fff' : '#fff'};
    color: ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,.85)' : 'rgba(0,0,0,.85)'};
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`,
);

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${theme.palette.mode === 'dark' ? '#fafafa' : '#fafafa'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#e8e8e8' : '#e8e8e8'};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#e6f7ff' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#fff' : '#fff'};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#fafafa' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#e6f7ff' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`,
);

function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [materials, setMaterials] = useState([]); // Initialize as an empty array
  const [allMaterials, setAllMaterials] = useState([]); // Initialize as an empty array
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materialAmount, setMaterialAmount] = useState('');
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    axios.get(`${URL}/projects/${id}`, { withCredentials: true })
      .then(res => {
        console.log('Project:', res.data);
        setProject(res.data);
        setProjectUsers(res.data.users || []);
      })
      .catch(err => {
        console.error(err);
      });

    axios.get(`${URL}/projects/${id}/materials`, { withCredentials: true })
      .then(res => {
        console.log('Materials:', res.data);
        setMaterials(res.data); // Ensure materials is set to an array
      })
      .catch(err => {
        console.error(err);
      });

    axios.get(`${URL}/materials`, { withCredentials: true }) // Fetch all materials
      .then(response => {
        console.log('All materials:', response.data);
        setAllMaterials(Array.isArray(response.data) ? response.data : []); // Ensure allMaterials is set to an array
      })
      .catch(error => {
        console.error('Error fetching materials:', error);
      });

    axios.get(`${URL}/projects/${id}/users`, { withCredentials: true }) // Adjust the URL as necessary
      .then(response => {
        console.log('Users:', response.data);
        setUsers(Array.isArray(response.data) ? response.data : []); // Ensure users is set to an array
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [id]);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value = [],
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    options: users,
    getOptionLabel: (option) => `${option.surname} ${option.name} | ${option.username}`,
    multiple: false,
    onChange: (event, newValue) => {
      setSelectedUser(newValue);
    },
  });

  const {
    getRootProps: getMaterialRootProps,
    getInputLabelProps: getMaterialInputLabelProps,
    getInputProps: getMaterialInputProps,
    getTagProps: getMaterialTagProps,
    getListboxProps: getMaterialListboxProps,
    getOptionProps: getMaterialOptionProps,
    groupedOptions: groupedMaterialOptions,
    value: materialValue = [],
    focused: materialFocused,
    setAnchorEl: setMaterialAnchorEl,
  } = useAutocomplete({
    id: 'materials-search-demo',
    options: allMaterials, // Use all materials for adding new materials
    getOptionLabel: (option) => option.name,
    multiple: false,
    onChange: (event, newValue) => {
      setSelectedMaterial(newValue);
    },
  });

  const handleAddUser = () => {
    if (selectedUser) {
      axios.post(`${URL}/projects/${id}/addUser`, { userId: selectedUser.id }, { withCredentials: true }) // Adjust the URL as necessary
        .then(response => {
          console.log('User added:', response.data);
          setProjectUsers(prev => [...prev, selectedUser]);
          setSelectedUser(null); // Reset selection
        })
        .catch(error => {
          console.error('Error adding user:', error);
        });
    } else {
      console.warn('No user selected');
    }
  };

  const handleDeleteUser = (userId) => {
    axios.post(`${URL}/projects/${id}/deleteUser/${userId}`, { withCredentials: true }) // Adjust the URL as necessary
      .then(response => {
        console.log('User removed:', response.data);
        setProjectUsers(prev => prev.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error('Error removing user:', error);
      });
  };

  const handleAddMaterial = () => {
    if (selectedMaterial && materialAmount <= selectedMaterial.amount && selectedMaterial.amount >= 1 && materialAmount >= selectedMaterial.amount * -1) {
      axios.post(`${URL}/projects/${id}/addMaterial`, { materialId: selectedMaterial.id, amount: materialAmount }, { withCredentials: true }) // Adjust the URL as necessary
        .then(response => {
          console.log('Material added:', response.data);
          window.location.reload();
        })
        .catch(error => {
          console.error('Error adding material:', error);
        });
    } else {
      console.warn('No material selected or amount is less than required');
    }
  };

  const handleDeleteMaterial = (materialId) => {
    axios.post(`${URL}/projects/${id}/deleteMaterial/${materialId}`, { withCredentials: true }) // Adjust the URL as necessary
      .then(response => {
        console.log('Material removed:', response.data);
        setMaterials(prev => prev.filter(m => m.material.id !== materialId));
        window.location.reload();
      })
      .catch(error => {
        console.error('Error removing user:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const saveProject = () => {
    axios.put(`${URL}/projects/${id}/update`, project, { withCredentials: true })
      .then(res => {
        console.log('Project updated:', res.data);
        // Handle success (e.g., show a success message)
      })
      .catch(err => {
        console.error(err);
        // Handle error (e.g., show an error message)
      });
  };

  const deleteProject = (e) => {
    axios.delete(`${URL}/projects/${id}/delete`, { withCredentials: true })
      .then(res => {
        console.log('Project deleted', res.data);
        navigate('/projects');
      })
      .catch(err => {
        console.error('Error deleting project:', err);
      });
  };

  const statusMapping = {
    ACTIVE: 'Активний',
    INACTIVE: 'Неактивний',
    COMPLETED: 'Виконаний',
    CANCELLED: 'Відмінений'
  };

  if (!project) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Box sx={{ padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Інформація про проєкт
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Назва"
                variant="outlined"
                name="name"
                value={project.name || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!(auth.role === 'DIRECTOR' || auth.role === 'MANAGER')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Номер проєкту"
                variant="outlined"
                name="numberOfProject"
                value={project.numberOfProject || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!(auth.role === 'DIRECTOR' || auth.role === 'MANAGER')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Дата подачі"
                variant="outlined"
                name="date"
                type="date"
                value={project.date || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                disabled={!(auth.role === 'DIRECTOR' || auth.role === 'MANAGER')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Додаткова інформація"
                variant="outlined"
                name="additionalInformation"
                multiline
                rows={7}
                value={project.additionalInformation || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!(auth.role === 'DIRECTOR' || auth.role === 'MANAGER')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Статус"
                variant="outlined"
                name="status"
                value={project.status || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                select
                SelectProps={{
                  native: true,
                }}
                disabled={!(auth.role === 'DIRECTOR')}
              >
                {Object.keys(statusMapping).map(key => (
                  <option key={key} value={key}>
                    {statusMapping[key]}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Участь"
                variant="outlined"
                name="participate"
                value={project.participate ? 'Так' : 'Ні'}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                select
                SelectProps={{
                  native: true,
                }}
                disabled={!(auth.role === 'DIRECTOR')}
              >
                <option value="true">Так</option>
                <option value="false">Ні</option>
              </TextField>
            </Grid>
          </Grid>
          {auth.role === 'DIRECTOR' || auth.role === 'MANAGER' ? (
            <Grid>
              <Button variant="contained" color="primary" onClick={saveProject} sx={{ marginTop: 2 }}>
                Зберегти
              </Button>
              <Button variant="contained" color="error" onClick={deleteProject} startIcon={<DeleteIcon />} sx={{ marginTop: 2, marginLeft: 2 }}>
                Видалити
              </Button>
            </Grid>
          ) : null}
          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h5" gutterBottom>
            Користувачі, які мають доступ
          </Typography>

          {auth.role === 'DIRECTOR' || auth.role === 'MANAGER' ? (
            <Root>
              <div {...getRootProps()}>
                <Label {...getInputLabelProps()}>Шукати користувача</Label>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
                    {Array.isArray(value) && value.map((option, index) => (
                      <StyledTag label={option.name} {...getTagProps({ index })} />
                    ))}
                    <input {...getInputProps()} />
                  </InputWrapper>
                  <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ marginLeft: 1 }}>
                    Додати користувача
                  </Button>
                </Box>
              </div>
              {groupedOptions.length > 0 ? (
                <Listbox {...getListboxProps()}>
                  {groupedOptions.map((option, index) => (
                    <li {...getOptionProps({ option, index })} key={option.id}>
                      <span>{`${option.surname} ${option.name} | ${option.username}`}</span>
                      <CheckIcon fontSize="small" />
                    </li>
                  ))}
                </Listbox>
              ) : null}
            </Root>
          ) : null}

          <List>
            {projectUsers.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={`${user.surname} ${user.name} | ${user.username}`} />
                {auth.role === 'DIRECTOR' || auth.role === 'MANAGER' ? (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUser(user.id)}>
                    <CloseIcon />
                  </IconButton>
                ) : null}
              </ListItem>
            ))}
          </List>

          <Divider sx={{ marginY: 2 }} />

          <Typography variant="h5" gutterBottom>
            Матеріали
          </Typography>

          {auth.role === 'DIRECTOR' || auth.role === 'MANAGER' ? (
            <Root>
              <div {...getMaterialRootProps()}>
                <Label {...getMaterialInputLabelProps()}>Шукати матеріал</Label>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InputWrapper ref={setMaterialAnchorEl} className={materialFocused ? 'focused' : ''}>
                    {Array.isArray(materialValue) && materialValue.map((option, index) => (
                      <StyledTag label={option.name} {...getMaterialTagProps({ index })} />
                    ))}
                    <input {...getMaterialInputProps()} />
                  </InputWrapper>
                  <Button variant="contained" color="secondary" onClick={handleAddMaterial} sx={{ marginLeft: 1 }}>
                    Додати матеріали
                  </Button>
                </Box>
              </div>
              {groupedMaterialOptions.length > 0 ? (
                <Listbox {...getMaterialListboxProps()}>
                  {groupedMaterialOptions.map((option, index) => (
                    <li {...getMaterialOptionProps({ option, index })} key={option.id}>
                      <span>{option.name}</span>
                      <CheckIcon fontSize="small" />
                    </li>
                  ))}
                </Listbox>
              ) : null}
            </Root>
          ) : null}
          {selectedMaterial && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1">
                Кількість матеріалу: {selectedMaterial.amount}
              </Typography>
              <TextField
                label="Кількість для додавання"
                variant="outlined"
                type="number"
                value={materialAmount}
                onChange={(e) => setMaterialAmount(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          )}

          <List>
            {Array.isArray(materials) && materials.map((material) => (
              <ListItem key={material.material.id}>
                <ListItemText primary={material.material.name} />
                <ListItemText primary={`Кількість: ${material.amount}`} />
                {auth.role === 'DIRECTOR' || auth.role === 'MANAGER' ? (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteMaterial(material.material.id)}>
                    <CloseIcon />
                  </IconButton>
                ) : null}
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default ProjectView;
