import client from './client';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await client.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  register: async (data: RegisterData): Promise<User> => {
    const response = await client.post('/auth/register', data);
    return response.data;
  },
  
  getMe: async (): Promise<User> => {
    const response = await client.get('/auth/me');
    return response.data;
  },
};
