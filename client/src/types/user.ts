export interface User {
  id: number;
  username: string;
  password: string;
  role: 'staff' | 'ketua' | 'pimpinan';
}