import { useState } from 'react';
import type { ITask, TaskStatus } from '../types/task';

interface LeaderTableProps {
  tasks: ITask[];
}

const LeaderTable = ({ tasks }: LeaderTableProps) => {
  // State filter sekarang hanya boleh diisi 'all' atau TaskStatus
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter(task => 
    filter === 'all' ? true : task.status === filter
  );

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Monitoring Progress</h2>
        <select 
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          onChange={(e) => setFilter(e.target.value as TaskStatus | 'all')}
        >
          <option value="all">Semua Status</option>
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 px-2">Tugas</th>
              <th className="pb-3 px-2">Staff</th>
              <th className="pb-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2 text-sm font-medium text-gray-700">{task.title}</td>
                <td className="py-4 px-2 text-sm text-gray-500">{task.assignee}</td>
                <td className="py-4 px-2">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                    task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderTable;