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

function ConditionalNavbar({ user }) {
  const location = useLocation(); // Safe inside Router context

  if (location.pathname === '/login') {
    return null; // Don't render Navbar on the login page
  }
  return <Navbar user={user} />; // Render Navbar on all other pages
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Correct placement of useNavigate within Router context

  // Token validation and user state management
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedUser.exp > currentTime) {
          setUser(decodedUser); // Token is valid, set user state
        } else {
          localStorage.removeItem('token'); // Remove expired token
          setUser(null); // Clear user state
          navigate('/login'); // Redirect to login if token expired
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null); // Clear user state in case of error
        navigate('/login'); // Redirect to login on error
      }
    } else {
      setUser(null); // No token, clear user state
      navigate('/login'); // Redirect to login if no token found
    }
  }, [navigate]); // Only depend on navigate here

  // Function to handle login state change
  const loginChange = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null); // Clear user if no stored user found
    }
  };

  return (
    <Router> {/* Ensure everything is wrapped inside Router */}
      <ConditionalNavbar user={user} />
      <Routes>
        <Route path='/login' element={<LoginForm loginChange={loginChange} />} />
        {user && user.role === 'manager' && (
          <Route path='/manager' element={<ManagerDashboardLayout />} />
        )}
        {user && user.role === 'admin' && (
          <Route path='/dashboard' element={<AdminDashboard />} />
        )}
        {user && user.role === 'employee' && (
          <Route path='/employee' element={<EmployeeExpensePage />} />
        )}
        {/* Catch unmatched routes */}
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
    </Router>
  );
}

export default App;
