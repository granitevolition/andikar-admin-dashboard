import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://web-production-a617.up.railway.app'}/token`, 
        new URLSearchParams({
          'username': username,
          'password': password
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const { access_token } = response.data;
      
      // Store token in axios headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Get user profile info
      const userResponse = await axios.get(`${process.env.REACT_APP_API_URL || 'https://web-production-a617.up.railway.app'}/users/me`);
      
      // Store in local storage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userResponse.data));
      
      setIsAuthenticated(true);
      setUser(userResponse.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};