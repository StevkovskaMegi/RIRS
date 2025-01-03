import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate} from 'react-router-dom';

const LoginForm = ({ loginChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/');
      }
    }
  }, [navigate, user.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/users/login',
        { email, password }
      );
      setToken(response.data.token);
      const { user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      loginChange();
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee');
      } else if (user.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.log(err.message);
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box mt={8}>
        <Typography variant='h4' component='h1' gutterBottom>
          Login
        </Typography>
        {error && <Alert severity='error'>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label='Email'
            variant='outlined'
            fullWidth
            margin='normal'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            fullWidth
            margin='normal'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            style={{ marginTop: '16px' }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
