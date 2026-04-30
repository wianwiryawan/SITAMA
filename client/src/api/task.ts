import api from './axios'; 

export interface ITaskData {
  id: number;
  title: string;
  status?: 'todo' | 'doing' | 'done'; 
  priority?: 'low' | 'medium' | 'high'; 
  assignee: number[]; 
}

export const getAllTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (taskData: ITaskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

// Partial agar saat update status saja tidak perlu kirim title
export const updateTask = async (id: number, taskData: Partial<ITaskData>) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};