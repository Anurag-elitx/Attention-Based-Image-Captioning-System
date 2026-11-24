import axios from 'axios';

let rawApiBase = import.meta.env.VITE_API_URL || '/api/v1';
if (rawApiBase.endsWith('/')) {
  rawApiBase = rawApiBase.slice(0, -1);
}
const API_BASE = (rawApiBase.startsWith('http') && !rawApiBase.endsWith('/api/v1'))
  ? `${rawApiBase}/api/v1`
  : rawApiBase;

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
