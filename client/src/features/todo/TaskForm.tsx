import { useState } from 'react';
import type { ITask, Priority, TaskStatus } from '../../types/task';

interface TaskFormProps {
  onAddTask: (task: ITask) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignee) return;

    const newTask: ITask = {
      id: Date.now(), // ID sementara pakai timestamp
      title,
      assignee,
      status: 'todo',
      priority: 'medium'
    };

    onAddTask(newTask);
    setTitle(''); // Reset form
    setAssignee('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          placeholder="Nama Tugas/Pekerjaan..." 
          className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Nama Staff..." 
          className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
      </div>
      <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full md:w-auto">
        + Tambah Tugas
      </button>
    </form>
  );
};

export default TaskForm;