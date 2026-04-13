import api from './axios';

interface User {
  username: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const loginUser = async (
  credentials: { username: string; password: string }
): Promise<LoginResponse> => {
  const response = await api.post('/login', credentials);

  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};