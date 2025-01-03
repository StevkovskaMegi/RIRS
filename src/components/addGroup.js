import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { addGroup } from '../services/api';

const AddGroup = ({ users, onGroupAdded }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      alert('Group name and members are required');
      return;
    }
    try {
      await addGroup({ name: groupName, members: selectedUsers });
      alert('Group created successfully');
      setGroupName('');
      setSelectedUsers([]);
      if (onGroupAdded) {
        onGroupAdded();
      }
    } catch (error) {
      alert('Error creating group');
    }
  };

  return (
    <div>
      <Box component='form' sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant='h6' gutterBottom>
          Manage Groups
        </Typography>
        <TextField
          label='Group Name'
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          fullWidth
          margin='normal'
        />
        <Select
          multiple
          value={selectedUsers}
          onChange={(e) => setSelectedUsers(e.target.value)}
          displayEmpty
          fullWidth
          renderValue={(selected) =>
            selected.length === 0 ? 'Select Members' : selected.join(', ')
          }
        >
          {users.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
        <Button variant='contained' sx={{ mt: 2 }} onClick={handleCreateGroup}>
          Create Group
        </Button>
      </Box>
    </div>
  );
};

export default AddGroup;
