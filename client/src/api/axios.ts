import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api',
  // baseURL: 'http://192.168.56.1:5000/api',
  // eslint-disable-next-line no-constant-binary-expression
  baseURL: `${window.location.protocol}//${window.location.hostname}:5000/api` || `${import.meta.env.VITE_API_URL}/api`,
  // baseURL: `${import.meta.env.VITE_API_URL}/api

});

// Interceptor untuk menempelkan Token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;