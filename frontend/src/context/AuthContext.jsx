import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/applications';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('trackrai_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure authorization header interceptor
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Load user data if token is present
  useEffect(() => {
    async function loadMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
        // Clear expired or invalid token
        localStorage.removeItem('trackrai_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, [token]);

  // Sign up
  const signup = async (email, password) => {
    try {
      await api.post('/auth/signup', { email, password });
      toast.success('Registration successful! Please login.');
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      throw err;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const accessToken = res.data.access_token;
      localStorage.setItem('trackrai_token', accessToken);
      setToken(accessToken);
      toast.success('Welcome back!');
      return true;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('trackrai_token');
    localStorage.removeItem('trackrai_activity'); // Reset local storage cache
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
