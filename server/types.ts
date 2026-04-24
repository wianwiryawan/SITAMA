export interface User {
  id: number;
  username: string;
  password: string;
  role: 'kasubdit' | 'katim' | 'staff' | 'tenagaahli';
}

export interface Task {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
  assignee_username: string;
  priority: 'low' | 'medium' | 'high';
}