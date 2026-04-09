import { useState } from "react";
import type { ITask } from "./types/task";
import TaskCard from "./components/TaskCard";
import LeaderTable from "./features/LeaderTable";
import TaskForm from "./components/TaskForm";

// Data awal (Mock Data)
const INITIAL_DATA: ITask[] = [
  { id: 1, title: "Koordinasi Subdit SIAK", status: "todo", assignee: "Pranata Komputer", priority: "high" },
];

function App() {
  // State utama: Di sinilah semua data tugas disimpan
  const [tasks, setTasks] = useState<ITask[]>(INITIAL_DATA);

  // Fungsi untuk menambah tugas baru
  const handleAddTask = (newTask: ITask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-indigo-900">SITAMA</h1>
        <p className="text-gray-500">Sistem Informasi Tata Manajemen - Ditjen Dukcapil</p>
      </header>

      {/* 1. Form Input */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Input Tugas Baru</h2>
        <TaskForm onAddTask={handleAddTask} />
      </section>

      {/* 2. Staff View (Trello Style) */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Board Tugas (Staff)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'doing', 'done'] as const).map((status) => (
            <div key={status} className="bg-gray-200/40 p-4 rounded-2xl border border-dashed border-gray-300 min-h-[400px]">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-gray-600 uppercase text-xs tracking-widest">{status}</h3>
                <span className="bg-gray-300 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
              
              {tasks.filter(t => t.status === status).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200 my-10"></div>

      {/* 3. Leader View (Table Style) */}
      <section>
        <LeaderTable tasks={tasks} />
      </section>
    </div>
  );
}

export default App;