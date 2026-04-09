import { useState } from "react";
import { 
  DndContext, closestCorners, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, type DragEndEvent, type DragOverEvent, useDroppable 
} from "@dnd-kit/core";
import { 
  arrayMove, SortableContext, verticalListSortingStrategy, useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Import Tipe Data
import type { ITask, TaskStatus, Priority } from "./types/task";

// --- KOMPONEN 1: TASK CARD ---
interface TaskCardProps {
  task: ITask;
  onClick: (task: ITask) => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

  const priorityStyles: Record<string, string> = {
    high: "bg-red-50 text-red-600 border border-red-100",
    medium: "bg-amber-50 text-amber-600 border border-amber-100",
    low: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  };

  return (
    <div
      ref={setNodeRef} style={style}
      className="touch-none bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 cursor-pointer hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group"
      onClick={() => onClick(task)} // Trigger Modal Detail
    >
      {/* Handler Drag: Agar klik biasa tidak dianggap drag, dnd-kit butuh listener di elemen spesifik atau seluruh kartu */}
      <div {...attributes} {...listeners}>
        <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <h3 className="text-gray-900 font-semibold text-sm leading-relaxed mt-3 mb-5">{task.title}</h3>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
          <div className="w-8 h-8 bg-indigo-600/10 rounded-full flex items-center justify-center text-xs text-indigo-700 font-bold border border-indigo-100">
            {task.assignee.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700 font-medium">{task.assignee}</span>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN 2: DROPPABLE COLUMN ---
interface ColumnProps { status: TaskStatus; tasks: ITask[]; onTaskClick: (task: ITask) => void; }
const DroppableColumn = ({ status, tasks, onTaskClick }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={`bg-gray-50/50 p-6 rounded-3xl min-h-[600px] border transition-colors ${isOver ? 'border-indigo-300 bg-indigo-50/20' : 'border-gray-100'}`}>
      <div className="flex justify-between items-center mb-6 px-1 text-xs font-extrabold text-gray-950 uppercase tracking-[0.2em]">
        <h3>{status}</h3>
        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1">
          {tasks.map((task) => <TaskCard key={task.id} task={task} onClick={onTaskClick} />)}
        </div>
      </SortableContext>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
export default function App() {
  const [tasks, setTasks] = useState<ITask[]>([
    { id: 1, title: "Koordinasi Teknis SIAK di Subdit II", status: "todo", assignee: "Andi", priority: "high" },
    { id: 2, title: "Penyusunan Bab IV Laporan Aktualisasi CPNS", status: "doing", assignee: "Budi", priority: "medium" },
  ]);

  // State Modal Tambah
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State Modal Detail/Edit
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor)
  );

  // Fungsi Tambah Tugas
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: ITask = {
      id: Date.now(),
      title: formData.get("title") as string,
      assignee: formData.get("assignee") as string,
      status: "todo",
      priority: formData.get("priority") as Priority,
    };
    setTasks([...tasks, newTask]);
    setIsAddModalOpen(false);
  };

  // Fungsi Update Tugas
  const handleUpdateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;
    const formData = new FormData(e.currentTarget);
    const updatedTasks = tasks.map(t => t.id === selectedTask.id ? {
      ...t,
      title: formData.get("title") as string,
      assignee: formData.get("assignee") as string,
      priority: formData.get("priority") as Priority,
    } : t);
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  // Fungsi Hapus Tugas
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    setSelectedTask(null);
  };

  // Drag Logic (Sama seperti sebelumnya)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;
    let newStatus: TaskStatus | null = null;
    if (['todo', 'doing', 'done'].includes(over.id as string)) newStatus = over.id as TaskStatus;
    else {
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }
    if (newStatus && activeTask.status !== newStatus) {
      setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: newStatus as TaskStatus } : t));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIdx = items.findIndex(t => t.id === active.id);
        const newIdx = items.findIndex(t => t.id === over.id);
        return arrayMove(items, oldIdx, newIdx);
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-14 antialiased">
      
      {/* MODAL TAMBAH TUGAS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-black mb-6">Tugas Baru</h2>
            <form onSubmit={handleAddTask} className="flex flex-col gap-5">
              <input name="title" required placeholder="Judul Tugas" className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="assignee" required placeholder="Nama Staff" className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500" />
              <select name="priority" className="w-full bg-gray-50 rounded-2xl p-4 outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-gray-950 text-white rounded-2xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL / EDIT TUGAS */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black">Detail Tugas</h2>
              <button onClick={() => handleDeleteTask(selectedTask.id)} className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">Hapus Tugas</button>
            </div>
            <form onSubmit={handleUpdateTask} className="flex flex-col gap-5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Judul</label>
              <input name="title" defaultValue={selectedTask.title} required className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500" />
              
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Staff</label>
              <input name="assignee" defaultValue={selectedTask.assignee} required className="w-full bg-gray-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500" />
              
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prioritas</label>
              <select name="priority" defaultValue={selectedTask.priority} className="w-full bg-gray-50 rounded-2xl p-4 outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setSelectedTask(null)} className="flex-1 py-4 font-bold text-gray-400 text-sm">Tutup</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm">Update Tugas</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-gray-950">SITAMA</h1>
          <p className="text-gray-500 font-medium">Sistem Informasi Tata Manajemen Ditjen Dukcapil</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-gray-950 text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl">
          + Buat Tugas Baru
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {(['todo', 'doing', 'done'] as const).map(status => (
              <DroppableColumn key={status} status={status} tasks={tasks.filter(t => t.status === status)} onTaskClick={setSelectedTask} />
            ))}
          </div>
        </DndContext>
      </main>

      {/* Monitoring Table */}
        <section className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-950 mb-8 tracking-tight">Monitoring Pimpinan</h2>
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Tugas</th><th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Staff</th><th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-50">{tasks.map(task => (
                <tr key={task.id} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="p-5 text-sm font-semibold text-gray-800">{task.title}</td>
                  <td className="p-5 text-sm text-gray-600">{task.assignee}</td>
                  <td className="p-5"><span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${task.status === 'done' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>{task.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
    </div>
  );
}