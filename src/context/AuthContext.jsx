import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/api';

const AuthContext = createContext({
  adminUser: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true
});

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('adminUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rely on persisted adminUser for UI state
    // Real session validation happens via cookies in api calls
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiRequest('/api/v1/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // Extract user data (tokens are handled automatically via cookies)
      const user = data.user || data.admin || data.data?.user || { email, role: 'admin' };
      
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check credentials.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ adminUser, login, logout, isAuthenticated: !!adminUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
