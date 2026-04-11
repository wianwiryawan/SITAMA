/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './axios';

export const loginUser = async (credentials: any) => {
  const response = await api.post('/login', credentials);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data; 
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};