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
      // Sadece sunucu tarafında kimlik doğrulama durumunu kontrol et
      // HTTP-only cookie otomatik olarak istekle gönderilecek
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
      
      // Token artık HTTP-only cookie olarak saklanıyor
      // localStorage veya headers ayarlamaya gerek yok
      
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
      // Bu istek, sunucu tarafında cookie'yi temizleyecek
      await axios.post('/auth.php?logout');
    } finally {
      // localStorage temizlemeye veya header silmeye gerek yok
      // Sadece uygulama durumunu sıfırlamamız gerekiyor
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