import React, { useState } from 'react';
import { addUser } from '../services/api';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [plainPassword, setPlainPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { name, role };
    try {
      const response = await addUser(user);
      setPlainPassword(response.plainPassword);
      setName('');
      setRole('employee');
      onUserAdded();
    } catch (error) {
      alert('Error adding user');
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant='h6' gutterBottom>
        Add New User
      </Typography>
      <TextField
        label='Name'
        variant='outlined'
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          label='Role'
        >
          <MenuItem value='employee'>Employee</MenuItem>
          <MenuItem value='manager'>Manager</MenuItem>
          <MenuItem value='admin'>Admin</MenuItem>
        </Select>
      </FormControl>
      <Button variant='contained' color='primary' type='submit' fullWidth>
        Add User
      </Button>
      {plainPassword && (
        <div>
          <p>
            Temporary Password: <strong>{plainPassword}</strong>
          </p>
        </div>
      )}
    </Box>
  );
};

export default AddUser;
