import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import AddUser from '../components/addUser';
import UserList from '../components/userlist';
import StatsPanel from '../components/statsPanel';
import AddGroup from '../components/addGroup';

import { getAllUsers, fetchUserCounts, fetchGroupCount } from '../services/api';

const AdminDashboard = () => {
  const [employeesCount, setEmployeesCount] = useState(0);
  const [managersCount, setManagersCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [refreshData, setRefreshData] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users and set employee and manager counts
    const getUserCounts = async () => {
      const { employeesCount, managersCount } = await fetchUserCounts();
      setEmployeesCount(employeesCount);
      setManagersCount(managersCount);
    };

    // Fetch groups and set group count
    const getGroupCount = async () => {
      const count = await fetchGroupCount();
      setGroupsCount(count);
    };
    // Fetch users
    const fetchUsers = async () => {
      const usersData = await getAllUsers();
      setUsers(usersData);
    };
    getUserCounts();
    getGroupCount();
    fetchUsers();
  }, [refreshData]);
  const refreshUserData = () => {
    setRefreshData((prev) => !prev);
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Panel */}
      <StatsPanel
        employees={employeesCount}
        managers={managersCount}
        groups={groupsCount}
      />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <AddUser onUserAdded={refreshUserData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AddGroup users={users} onGroupAdded={refreshUserData} />
        </Grid>
      </Grid>

      {/* User List Panel */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <UserList users={users} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
