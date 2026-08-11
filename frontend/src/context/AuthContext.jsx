import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/applications';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

 // Attempt to load user profile. If successful, cookie is present and valid.
 useEffect(() => {
 async function loadMe() {
 try {
 // The HttpOnly cookie is automatically sent by axios due to withCredentials: true
 const res = await api.get('/auth/me');
 setUser(res.data);
 setIsAuthenticated(true);
 } catch (err) {
 setIsAuthenticated(false);
 setUser(null);
 } finally {
 setLoading(false);
 }
 }
 loadMe();
 }, []);

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
 await api.post('/auth/login', { email, password });
 // Cookie is now set automatically via Set-Cookie header
 
 setIsAuthenticated(true);
 // Re-fetch the user profile to populate user state
 const res = await api.get('/auth/me');
 setUser(res.data);
 toast.success('Welcome back!');
 return true;
 } catch (err) {
 setIsAuthenticated(false);
 setUser(null);
 const msg = err.response?.data?.detail || 'Invalid email or password';
 toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
 throw err;
 }
 };

 // Logout
 const logout = async () => {
 try {
 await api.post('/auth/logout');
 } catch (err) {
 console.error('Logout failed on backend:', err);
 }
 localStorage.removeItem('trackrai_activity'); // Reset local storage cache
 setIsAuthenticated(false);
 setUser(null);
 toast.success('Logged out successfully.');
 };

 const value = {
 user,
 loading,
 isAuthenticated,
 signup,
 login,
 logout,
 };

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
