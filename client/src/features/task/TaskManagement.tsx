/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useTasks } from "./useTask";
import { useTaskActions } from "./useTaskAction";
import AddTaskModal from "./AddTaskModal";
import TaskTable from "./TaskTable";
import { closestCorners } from "@dnd-kit/core";
// import type { ITask } from "../../types/task";
import KanbanManual from "./KanbanManual";
import TaskDetailModal from "./TaskDetailModal";
import type { ITaskData } from "../../api/task";

export default function ToDoList({ currentUser }: any) {
  const { tasks, loading, fetchTasks } = useTasks();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logs, setLogs] = useState([]);
  const [selectedTask, setSelectedTask] = useState<ITaskData | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
  
  const role = currentUser.role;
  const canAddTask = role === 'katim' || role === 'kasubdit' || role === 'staff' || role === 'tenagaahli';
  const canSeeKanban = role === 'staff' || role === 'katim' || role === 'kasubdit' || role === 'tenagaahli';
  // const canSeeTable = role === 'katim' || role === 'kasubdit';
  const iskasubdit = role === 'kasubdit';
  
  const {
    allUsers,
    selectedParticipantIds, setSelectedParticipantIds,
    isDropdownOpen, setIsDropdownOpen,
    searchTerm, setSearchTerm,
    customParticipants, setCustomParticipants,
  } = useTasks();
  
  const {
    // handleAddTask,
    handleDeleteTask,
    // handleUpdateTask,
    isModalOpen, setIsModalOpen,
    setIsAddModalOpen, isAddModalOpen,
    handleSaveTask
  } = useTaskActions(currentUser, fetchTasks, setLogs, selectedParticipantIds);


  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fffcf5] text-[#521f12] p-6 md:p-14 antialiased selection:bg-indigo-100 rounded-[2.5rem]">
      {isAddModalOpen && (
        <AddTaskModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSaveTask}
        allUsers={allUsers}
        selectedParticipantIds={selectedParticipantIds}
        setSelectedParticipantIds={setSelectedParticipantIds}
        customParticipants={customParticipants}
        setCustomParticipants={setCustomParticipants}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
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
          onTaskClick={(e) => {
            setSelectedTask(e);
            setIsModalOpen(true);
        }}
          fetchTasks={fetchTasks}
          />
      )}

      {isModalOpen && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onDelete={(id: number) => handleDeleteTask(id, () => setSelectedTask(null))}
          onSubmit={handleSaveTask}
          allUsers={allUsers}
          selectedParticipantIds={selectedParticipantIds}
          setSelectedParticipantIds={setSelectedParticipantIds}
          customParticipants={customParticipants}
          setCustomParticipants={setCustomParticipants}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      <TaskTable tasks={tasks} />
    </div>
  );
}