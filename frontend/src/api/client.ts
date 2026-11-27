import axios from 'axios';

let rawApiBase = import.meta.env.VITE_API_URL || '/api/v1';
if (rawApiBase.endsWith('/')) {
  rawApiBase = rawApiBase.slice(0, -1);
}
const API_BASE = (rawApiBase.startsWith('http') && !rawApiBase.endsWith('/api/v1'))
  ? `${rawApiBase}/api/v1`
  : rawApiBase;

const API_ORIGIN = API_BASE.startsWith('http')
  ? API_BASE.replace(/\/api\/v1$/, '')
  : '';

export function resolveAssetUrl(path?: string | null): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }
  if (!API_ORIGIN) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

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
