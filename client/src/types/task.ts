export type TaskStatus = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface ITask {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: number[];
  priority: Priority;
  note: string;
}

export interface ILog {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}