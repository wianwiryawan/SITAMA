export type TaskStatus = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface IEvent {
  id: number;
  title: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:mm
  endTime: string; // Format: HH:mm
  participants: string[];
  location: string;
}

export interface ITask {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: string;
  priority: Priority;
}