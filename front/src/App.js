import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import Navbar from './components/NavBar.js';
import AdminDashboard from './pages/adminDashboard';
import LoginForm from './pages/loginform';
import EmployeeExpensePage from './pages/employeeExpensePage';
import ManagerDashboardLayout from './layout/ManagerDashboardLayout';
import { jwtDecode } from 'jwt-decode';

// function ConditionalNavbar({ user }) {
//   const location = useLocation(); // Safe inside Router context

//   if (location.pathname === '/login') {
//     return null; // Don't render Navbar on the login page
//   }
//   return <Navbar user={user} />; // Render Navbar on all other pages
// }

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Correct placement of useNavigate within Router context

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        console.log('Decoded User:', decodedUser);

        const currentTime = Date.now() / 1000;
        if (decodedUser.exp > currentTime) {
          setUser(decodedUser);
          navigate('/dashboard');
        } else {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null);
        navigate('/login');
      }
    } else {
      setUser(null);
      navigate('/login');
    }
    setLoading(false); // Set loading to false after checking the token
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path='/login' element={<LoginForm />} />
      {user && user.role === 'manager' && (
        <Route path='/manager' element={<ManagerDashboardLayout />} />
      )}
      {user && user.role === 'admin' && (
        <Route path='/dashboard' element={<AdminDashboard />} />
      )}
      {user && user.role === 'employee' && (
        <Route path='/employee' element={<EmployeeExpensePage />} />
      )}
      <Route
        path='*'
        element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Unauthorized</h1>
            <p>You are not authorized to access this page</p>
          </div>
        }
      />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router> {/* Ensure the Router is at the top level */}
      <App />
    </Router>
  );
}
