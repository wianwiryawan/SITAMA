import { useState } from "react";
import { 
  DndContext, closestCorners, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, type DragEndEvent, type DragOverEvent, useDroppable 
} from "@dnd-kit/core";
import { 
  arrayMove, SortableContext, verticalListSortingStrategy, useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskStatus = 'todo' | 'doing' | 'done';
type Priority = 'low' | 'medium' | 'high';

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

// --- KOMPONEN 1: TASK CARD ---
const TaskCard = ({ task, onClick }: { task: ITask; onClick: (task: ITask) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

  const priorityStyles: Record<Priority, string> = {
    high: "bg-red-50 text-red-600 border-red-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    low: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div
      ref={setNodeRef} style={style}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 cursor-pointer hover:border-indigo-200 transition-all group"
      onClick={() => onClick(task)}
    >
      <div {...attributes} {...listeners} className="touch-none">
        <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        <h3 className="text-gray-950 font-bold text-sm leading-snug mt-3 mb-5">{task.title}</h3>
        <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
          <div className="w-6 h-6 bg-gray-950 rounded-full flex items-center justify-center text-[8px] text-white font-black uppercase">
            {task.assignee.charAt(0)}
          </div>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{task.assignee}</span>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN 2: DROPPABLE COLUMN ---
const DroppableColumn = ({ status, tasks, onTaskClick }: { status: TaskStatus; tasks: ITask[]; onTaskClick: (task: ITask) => void }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={`bg-gray-50/50 p-6 rounded-[2.5rem] min-h-[500px] border transition-all ${isOver ? 'bg-indigo-50/30 border-indigo-200' : 'border-gray-50'}`}>
      <div className="flex justify-between items-center mb-8 px-2">
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">{status}</h3>
        <span className="bg-white text-gray-400 text-[9px] font-black px-2 py-1 rounded-lg border border-gray-100 shadow-sm">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col">
          {tasks.map((task) => <TaskCard key={task.id} task={task} onClick={onTaskClick} />)}
        </div>
      </SortableContext>
    </div>
  );
};

// --- MAIN APP ---
export default function SITAMAApp({ currentUser = { name: "Andi", role: "Staff" } }) {
  const [tasks, setTasks] = useState<ITask[]>([
    { id: 1, title: "Update Database SIAK Terpusat", status: "todo", assignee: "Rizka", priority: "high" },
    { id: 2, title: "Review Laporan Bulanan Subdit", status: "doing", assignee: "Yara", priority: "medium" },
    { id: 3, title: "Koordinasi Teknis Integrasi Data", status: "todo", assignee: "Lala", priority: "high" },
  ]);

  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  
const role = currentUser.role.toLowerCase();

const isStaf = role === 'staff';
const isKetua = role === 'ketua';
const isPimpinan = role === 'pimpinan';

const canAddTask = isKetua || isPimpinan;
const canSeeKanban = isStaf || isKetua;
const canSeeTable = isKetua || isPimpinan;

  // Sensor Drag
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const [logs, setLogs] = useState<ILog[]>([
    { id: 1, user: "Budi", action: "Memindahkan", target: "Update Database SIAK", timestamp: "10:30" },
  ]);

  const addLog = (action: string, target: string) => {
    const newLog: ILog = {
      id: Date.now(),
      user: currentUser.name,
      action: action,
      target: target,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Simpan 50 log terbaru
  };

  // Filter Logika: Jika Pimpinan, paksa 'all'. Jika Staff, cek tombol toggle.
  const filteredTasks = (!isPimpinan && filterMode === 'mine')
    ? tasks.filter(t => t.assignee.toLowerCase() === currentUser.name.toLowerCase())
    : tasks;

  // Handlers
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
    addLog("Membuat tugas baru", formData.get("title") as string);
  };

  const handleUpdateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;
    const formData = new FormData(e.currentTarget);
    setTasks(tasks.map(t => t.id === selectedTask.id ? {
      ...t,
      title: formData.get("title") as string,
      assignee: formData.get("assignee") as string,
      priority: formData.get("priority") as Priority,
    } : t));
    setSelectedTask(null);
     addLog("Memperbarui tugas", formData.get("title") as string);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    setSelectedTask(null);
    // addLog("Menghapus tugas", formData.get("title") as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || isPimpinan) return; // Pimpinan dilarang geser (hanya monitoring)
    
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

  if (over && active.id !== over.id && !isPimpinan) {
    let movedTask: ITask | undefined;

    setTasks((items) => {
      const oldIdx = items.findIndex(t => t.id === active.id);
      const newIdx = items.findIndex(t => t.id === over.id);

      movedTask = items[oldIdx]; // ambil task yang dipindah

      return arrayMove(items, oldIdx, newIdx);
    });

    if (movedTask) {
      addLog("Mengubah status", movedTask.title);
      console.log(movedTask.title);
    }
  }
};

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 md:p-14 antialiased selection:bg-indigo-100">
      
      {/* MODAL TAMBAH */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4">
          <form onSubmit={handleAddTask} className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Tugas Baru <span className="text-indigo-600">.</span></h2>
            <div className="space-y-4">
              <input name="title" required placeholder="Apa yang perlu dikerjakan?" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-indigo-500/20 border-none" />
              <input name="assignee" required placeholder="Nama Pelaksana" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border-none" />
              <select name="priority" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border-none appearance-none">
                <option value="low">Priority: Low</option>
                <option value="medium">Priority: Medium</option>
                <option value="high">Priority: High</option>
              </select>
            </div>
            <div className="flex gap-4 mt-10">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 uppercase text-[10px]">Batal</button>
              <button type="submit" className="flex-1 py-4 bg-gray-950 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-950 ">SITAMA</h1>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mt-2">Manajemen Tugas</p>
        </div>

        <div className="flex items-center gap-4">
          {!isPimpinan && (
            <div className="bg-gray-100 p-1.5 rounded-2xl flex border border-gray-100">
              <button onClick={() => setFilterMode('all')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${filterMode === 'all' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}>Semua</button>
              <button onClick={() => setFilterMode('mine')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${filterMode === 'mine' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}>Milik Saya</button>
            </div>
          )}
          {canAddTask && (
            <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-gray-950 transition-all"
            >
                + Tambah Tugas
            </button>
           )}
        </div>
      </header>

      {/* KANBAN BOARD */}
      {canSeeKanban && (
  <main className="max-w-7xl mx-auto mb-24">
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragOver={handleDragOver} 
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {(['todo', 'doing', 'done'] as const).map(status => (
          <DroppableColumn 
            key={status} 
            status={status} 
            tasks={filteredTasks.filter(t => t.status === status)} 
            onTaskClick={setSelectedTask} 
          />
        ))}
      </div>
    </DndContext>
  </main>
)}
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


      {/* MONITORING TABLE (Bawah) */}
      {canSeeTable && (
      <section className="max-w-7xl mx-auto bg-gray-50/50 p-12 rounded-[3.5rem] border border-gray-50 shadow-inner">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Daftar Tugas</h2>
        </div>
        <div className="overflow-hidden bg-white rounded-4xl border border-gray-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama Kegiatan / Tugas</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pelaksana</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 text-sm font-bold text-gray-900">{task.title}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black uppercase border border-indigo-100">
                        {task.assignee[0]}
                      </div>
                      <span className="text-[11px] font-bold text-gray-600">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-tighter border ${
                      task.status === 'done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      task.status === 'doing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-gray-950 rounded-[3rem] p-10 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Riwayat Aksi</h2>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          </div>
          
          <div className="space-y-6 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
            {logs.map(log => (
              <div key={log.id} className="border-l-2 border-white/10 pl-4 py-1 relative">
                <div className="absolute -left-1.25 top-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">
                  {log.timestamp}
                </p>
                <p className="text-xs font-medium leading-relaxed">
                  <span className="font-black text-white">{log.user}</span> {log.action} <span className="italic text-gray-400">"{log.target}"</span>
                </p>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-[10px] text-gray-500 font-bold italic uppercase tracking-widest text-center py-10">Belum ada aktivitas.</p>
            )}
          </div>
        </div>
        </div>
      </section>
      )};
    </div>
  );
}