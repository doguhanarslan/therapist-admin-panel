import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to get token from localStorage
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        // Set the token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Manually decode the token (simple method for now)
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp > Date.now() / 1000) {
            setAuthenticated(true);
            setUser(payload.data);
            return;
          }
        }
      }
      
      // If no valid token in localStorage, try the server check
      const response = await axios.get('/auth.php?check');
      if (response.data.authenticated) {
        setAuthenticated(true);
        setUser(response.data.user);
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post('/auth.php', { username, password });
      console.log('Login response:', response.data);
      
      // If token is included in the response
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      setAuthenticated(true);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth.php?logout');
    } finally {
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
      setAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authenticated, 
      user, 
      loading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};