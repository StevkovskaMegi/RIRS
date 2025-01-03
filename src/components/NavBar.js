import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [userData, setUserData] = useState(user || { name: '', surname: '' });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const userLocal = localStorage.getItem('user');
    setUserData(userLocal);
  }, [userData.name]);
  return (
    <AppBar position='static' sx={{ backgroundColor: '#2751a1' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* <Avatar sx={{ bgcolor: '#d9c67e', mr: 1 }}>
          {userData.name ? userData.name.charAt(0) : <AccountCircle />}
        </Avatar> */}
        <Typography variant='h6' sx={{ flexGrow: 1, color: '#d9c67e' }}>
          {/* <Typography
            variant='subtitle1'
            sx={{
              color: '#FFFFFF',
              mr: 2,
              display: { xs: 'block', sm: 'block' },
            }}
          >
            {userData.name}
          </Typography> */}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color='inherit' onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
