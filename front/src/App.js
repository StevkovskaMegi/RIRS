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
  const location = useLocation(); // This is now safely within the Router context.

  if (location.pathname === '/login') {
    return null; // Don't render the Navbar on the login page.
  }
  return <Navbar user={user} />; // Render Navbar on all other pages.
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // <-- Use the hook here

  // Combine token check and user state management
  useEffect(() => {
    console.log('Checking token validity...');
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedUser.exp > currentTime) {
          setUser(decodedUser); // Set user state if the token is valid
        } else {
          console.warn('Token has expired');
          localStorage.removeItem('token');
          setUser(null); // Clear user state
          navigate('/login'); // Redirect to login
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setUser(null); // Clear user state
        navigate('/login'); // Redirect to login
      }
    } else {
      console.log('No token found, user not authenticated');
      setUser(null); // Clear user state
      navigate('/login'); // Redirect to login
    }
  }, [navigate]); // Only depend on navigate here

  // Handle login state change
  const loginChange = () => {
    const storedUser = localStorage.getItem('user');
    console.log('stored user', storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  return (
    <Router>
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
