import { createContext, useState, useEffect, useCallback } from 'react';
import authAPI from '../services/auth.service';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.getMe();
      setUser(res.data.data.user);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const res = await authAPI.login(credentials);
    const { user: userData, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(userData);
    toast.success('Welcome back!');
    return userData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { user: userData, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(userData);
    toast.success('Account created successfully!');
    return userData;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue with local logout even if API fails
    }
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
