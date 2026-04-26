/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useTasks } from "./useTask";
import { useTaskActions } from "./useTaskAction";
import AddTaskModal from "./AddTaskModal";
import TaskTable from "./TaskTable";
import TaskLogs from "./TaskLog";
import { closestCorners } from "@dnd-kit/core";
import type { ITask } from "../../types/task";
import KanbanManual from "./KanbanManual";
import TaskDetailModal from "./TaskDetailModal";

export default function ToDoList({ currentUser }: any) {
  const { tasks, loading, fetchTasks } = useTasks();
  const [logs, setLogs] = useState([]);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
  
  const role = currentUser.role;
  const canAddTask = role === 'katim' || role === 'kasubdit' || role === 'staff' || role === 'tenagaahli';
  const canSeeKanban = role === 'staff' || role === 'katim' || role === 'kasubdit' || role === 'tenagaahli';
  // const canSeeTable = role === 'katim' || role === 'kasubdit';
  const iskasubdit = role === 'kasubdit';

  const {
    handleAddTask,
    handleDeleteTask,
    handleUpdateTask,
  } = useTaskActions(currentUser, fetchTasks, setLogs);

  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#521f12] p-6 md:p-14 antialiased selection:bg-indigo-100 rounded-[2.5rem]">
      {isAddModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(e: any) => {
            e.preventDefault();
            handleAddTask(new FormData(e.target), () => setIsAddModalOpen(false));
          }}
        />
      )}

      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Daftar Tugas</h2>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">
            Sistem Informasi Tata Manajemen
          </p>   
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">
           Subdit SIAK
          </p>   
        </div>

        <div className="flex items-center gap-4">
          {!iskasubdit && (
            <div className="bg-gray-100 p-1.5 rounded-2xl flex border border-gray-100">
              <button onClick={() => setFilterMode('all')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterMode === 'all' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-400'}`}>Semua Tugas</button>
              <button onClick={() => setFilterMode('mine')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterMode === 'mine' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-400'}`}>Tugas Saya</button>
            </div>
          )}
          {canAddTask && (
            <button onClick={() => setIsAddModalOpen(true)} className="bg-amber-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-gray-950 transition-all">
                + Tambah Tugas
            </button>
           )}
        </div>
      </header>

      {canSeeKanban && (
        <KanbanManual 
          closestCorners={closestCorners} 
          currentUser={currentUser}
          filterMode={filterMode}
          setSelectedTask={setSelectedTask}
          fetchTasks={fetchTasks}
          />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onDelete={(id: number) => handleDeleteTask(id, () => setSelectedTask(null))}
          onSubmit={(e: any) => {
            e.preventDefault();
            handleUpdateTask(selectedTask.id, new FormData(e.target), () => setSelectedTask(null));
          }}
        />
      )}

      <TaskTable tasks={tasks} />
      <TaskLogs logs={logs} />
    </div>
  );
}