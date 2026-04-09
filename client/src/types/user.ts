export interface User {
  id: number;
  username: string;
  password: string;
  role: 'Pimpinan' | 'Ketua Tim' | 'Staff';
}