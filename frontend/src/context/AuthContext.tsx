import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { access_token } = await authApi.login(credentials);
    localStorage.setItem('token', access_token);
    const userData = await authApi.getMe();
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    await authApi.register(data);
    await login({ username: data.username, password: data.password });
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const userData = await authApi.getMe();
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
