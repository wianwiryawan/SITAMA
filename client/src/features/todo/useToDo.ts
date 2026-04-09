import { useState } from "react";

export type TaskStatus = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface ITask {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: string;
  priority: Priority;
}

interface ILog {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export function useTodo(currentUser: any) {
  const [tasks, setTasks] = useState<ITask[]>([
    { id: 1, title: "Update Database", status: "todo", assignee: "Rizka", priority: "high" },
  ]);

  const [logs, setLogs] = useState<ILog[]>([]);

  const addLog = (action: string, target: string) => {
    const newLog: ILog = {
      id: Date.now(),
      user: currentUser.name,
      action,
      target,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addTask = (task: ITask) => {
    setTasks(prev => [...prev, task]);
    addLog("Membuat tugas", task.title);
  };

  const updateTask = (updated: ITask) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    addLog("Update tugas", updated.title);
  };

  const deleteTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    if (task) addLog("Hapus tugas", task.title);
  };

  return {
    tasks,
    logs,
    addTask,
    updateTask,
    deleteTask,
    setTasks
  };
}