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
    const initializeAuth = async () => {
      try {
        if (adminUser) {
          // Verify session with server on load
          await apiRequest('/api/v1/auth/validate-token');
        }
      } catch (error) {
        console.error('Session validation failed on startup:', error);
        // apiRequest will handle the redirect on 401
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
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
